import * as wf from "@temporalio/workflow";
import { proxyActivities, proxySinks } from "@temporalio/workflow";
const { logger } = proxySinks();

import { Client, ClientOptions } from "../api/client";
import {
  DisplayConfig,
  isStatusTerminal,
  ParamSchema,
  ParamValues,
  Run,
  RunStatus,
} from "../api/types";
import { RuntimeInterface } from "./index";

// Recommended activity factory by Temporal: https://docs.temporal.io/typescript/activities/#important-design-patterns
//
// We re-initialize the client in each activity because there seems to be an issue with Temporal serializing
// classes - the object that is returned by the activity will have no methods associated with it.
export const createActivities = () => ({
  executeTaskActivity: async (
    slug: string,
    params: Record<string, unknown> | undefined | null,
    resources: Record<string, string> | undefined | null,
    opts?: ClientOptions
  ): Promise<string> => {
    const client = new Client(opts);
    return client.executeTask(slug, params, resources);
  },
  getRunOutputActivity: async <Output = unknown>(
    runID: string,
    opts?: ClientOptions
  ): Promise<Output> => {
    const client = new Client(opts);
    return client.getRunOutput(runID);
  },
  createPromptActivity: async (params: ParamSchema[], opts?: ClientOptions): Promise<string> => {
    const client = new Client(opts);
    return client.createPrompt(params);
  },
  createDisplayActivity: async (display: DisplayConfig, opts?: ClientOptions): Promise<void> => {
    const client = new Client(opts);
    await client.createDisplay(display);
  },
});

const { executeTaskActivity, getRunOutputActivity, createPromptActivity, createDisplayActivity } =
  proxyActivities<ReturnType<typeof createActivities>>({
    startToCloseTimeout: "120s",
    retry: {
      maximumAttempts: 1,
    },
  });

export const runtime: RuntimeInterface = {
  execute: async <Output = unknown>(
    slug: string,
    params: ParamValues = {},
    resources?: Record<string, string> | undefined | null,
    opts: ClientOptions = {}
  ): Promise<Run<typeof params, Output>> => {
    opts = passthroughOptions(opts);
    const runID = await executeTaskActivity(slug, params, resources, opts);

    // Register termination signal for the workflow. We ensure signal name uniqueness by including the run ID of the task
    // being executed in the signal name, as a workflow task may execute any number of other tasks.
    const signal = wf.defineSignal<
      [
        {
          taskID: string;
          paramValues: typeof params;
          status: RunStatus;
        }
      ]
    >(`${runID}-termination`);

    let taskID = "";
    let paramValues: typeof params = {};
    let status: RunStatus = RunStatus.NotStarted;
    wf.setHandler(signal, (payload) => {
      taskID = payload.taskID;
      paramValues = payload.paramValues;
      status = payload.status;
    });

    // Defer workflow execution until the task has been completed.
    await wf.condition(() => isStatusTerminal(status));

    const output = await getRunOutputActivity<Output>(runID, opts);

    return {
      id: runID,
      taskID,
      paramValues,
      status,
      output,
    };
  },

  prompt: async (params: ParamSchema[], opts: ClientOptions = {}): Promise<ParamValues> => {
    opts = passthroughOptions(opts);
    const promptID = await createPromptActivity(params, opts);

    // Register a signal that is fired when this prompt is submitted.
    const signal = wf.defineSignal<
      [
        {
          values: ParamValues;
        }
      ]
    >(`${promptID}-submitted`);

    let done = false;
    let values: ParamValues = {};
    wf.setHandler(signal, (payload) => {
      values = payload.values;
      done = true;
    });

    // Defer execution until the signal fires.
    await wf.condition(() => done);

    return values;
  },

  display: async (display: DisplayConfig, opts: ClientOptions = {}): Promise<void> => {
    opts = passthroughOptions(opts);
    await createDisplayActivity(display, opts);
  },

  logChunks: (output: string): void => {
    const CHUNK_SIZE = 8192;
    if (output.length <= CHUNK_SIZE) {
      logger.info(output);
    } else {
      const chunkKey = wf.uuid4();
      for (let i = 0; i < output.length; i += CHUNK_SIZE) {
        logger.info(`airplane_chunk:${chunkKey} ${output.substring(i, i + CHUNK_SIZE)}`);
      }
      logger.info(`airplane_chunk_end:${chunkKey}`);
    }
  },
};

const passthroughOptions = (opts: ClientOptions): ClientOptions => {
  // Activities do not (currently) have access to run environment variables. This is because
  // environment variables are passed as workflow arg that is monkey-patched into
  // `process.env` from the workflow shim. For the environment variables that need to be
  // accessed from activities, pass them through as options.
  //
  // The primary exception is the API host. This _is_ set within activities since it is
  // specific to the agent/worker.
  return {
    ...opts,
    token: opts.token || process.env.AIRPLANE_TOKEN,
    apiKey: opts.apiKey || process.env.AIRPLANE_API_KEY,
    envID: opts.envID || process.env.AIRPLANE_ENV_ID,
    envSlug: opts.envSlug || process.env.AIRPLANE_ENV_SLUG,
  };
};
