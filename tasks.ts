import * as wf from "@temporalio/workflow";
import { proxyActivities } from "@temporalio/workflow";

import type { _registerActivities } from "./activities";
import { executeTask, getRunOutput, getFetcher, ExecuteOptions } from "./api";
import { Poller } from "./poll";

const { executeTaskActivity, getRunOutputActivity } = proxyActivities<
  ReturnType<typeof _registerActivities>
>({
  startToCloseTimeout: "120s",
});

export enum RunStatus {
  NotStarted = "NotStarted",
  Queued = "Queued",
  Active = "Active",
  Succeeded = "Succeeded",
  Failed = "Failed",
  Cancelled = "Cancelled",
}

const terminalStatuses = [RunStatus.Succeeded, RunStatus.Failed, RunStatus.Cancelled];

export type Run<Input = unknown, Output = unknown> = {
  id: string;
  taskID: string;
  paramValues: Input;
  status: RunStatus;
  output: Output;
};

export const execute = async <Output = unknown>(
  slug: string,
  params?: Record<string, unknown> | undefined | null,
  opts?: ExecuteOptions
): Promise<Run<typeof params, Output>> => {
  return executeInternal(slug, params, {}, opts);
};

export const executeInternal = async <Output = unknown>(
  slug: string,
  params?: Record<string, unknown> | undefined | null,
  resources?: Record<string, string> | undefined | null,
  opts?: ExecuteOptions
): Promise<Run<typeof params, Output>> => {
  const env = typeof process === "undefined" ? {} : process?.env;
  const runtime = opts?.runtime || env?.AIRPLANE_RUNTIME || "standard";
  if (runtime === "workflow") {
    return durableExecute(slug, params, resources, opts ?? {});
  }

  const fetcher = getFetcher(opts);
  const runID = await executeTask(fetcher, slug, params, resources);

  // Poll until the run terminates:
  const poller = new Poller({ delayMs: 500 });
  return poller.run(async () => {
    const run = await fetcher.get<{
      id: string;
      status: RunStatus;
      paramValues: typeof params;
      taskID: string;
      isStdAPI: boolean;
      stdAPIRequest: {
        request: typeof params;
      };
    }>("/v0/runs/get", { id: runID });

    if (!terminalStatuses.includes(run.status)) {
      return null;
    }

    const output = await getRunOutput<Output>(fetcher, runID);

    let paramValues = run.paramValues;
    if (run.isStdAPI) {
      paramValues = run.stdAPIRequest.request;
    }
    return {
      id: run.id,
      taskID: run.taskID,
      paramValues: paramValues,
      status: run.status,
      output,
    };
  });
};

export const durableExecute = async <Output = unknown>(
  slug: string,
  params?: Record<string, unknown> | undefined | null,
  resources?: Record<string, string> | undefined | null,
  opts?: ExecuteOptions
): Promise<Run<typeof params, Output>> => {
  // While we monkey-patch env vars into the workflow's global, activities run in the main Node.js thread and so have a
  // different set of env vars. We instead pass the required values to initialize the fetcher using the ExecuteOptions
  // object from Workflow -> Activity.
  if (opts != null) {
    opts.token = opts?.token || process.env.AIRPLANE_TOKEN;
    opts.apiKey = opts?.apiKey || process.env.AIRPLANE_API_KEY;
    opts.envID = opts?.envID || process.env.AIRPLANE_ENV_ID;
    opts.envSlug = opts?.envSlug || process.env.AIRPLANE_ENV_SLUG;
  }
  const runID = await executeTaskActivity(slug, params, resources, opts);

  // Register termination signal for the workflow. We ensure signal name uniqueness by including the run ID of the task
  // being executed in the signal name, as a workflow task may execute any number of other tasks.
  type runTerminationSignal = {
    TaskID: string;
    ParamValues: typeof params;
    Status: RunStatus;
  };
  const taskSignal = wf.defineSignal<[runTerminationSignal]>(`${runID}-termination`);

  let taskID = "";
  let paramValues: typeof params = undefined;
  let status: RunStatus = RunStatus.NotStarted;
  wf.setHandler(taskSignal, (payload: runTerminationSignal) => {
    taskID = payload.TaskID;
    paramValues = payload.ParamValues;
    status = payload.Status;
  });

  // Defer workflow execution until the task has been completed.
  await wf.condition(() => terminalStatuses.includes(status));

  const output = await getRunOutputActivity<Output>(runID, opts);

  return {
    id: runID,
    taskID,
    paramValues,
    status,
    output,
  };
};
