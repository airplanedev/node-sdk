import * as wf from "@temporalio/workflow";
import { proxyActivities } from "@temporalio/workflow";

import type { _registerActivities } from "../activities";
import { ClientOptions } from "../api/client";
import { isStatusTerminal, Run, RunStatus } from "../api/types";
import { RuntimeInterface } from "./index";

const { executeTaskActivity, getRunOutputActivity } = proxyActivities<
  ReturnType<typeof _registerActivities>
>({
  startToCloseTimeout: "120s",
});

export const runtime: RuntimeInterface = {
  execute: async <Output = unknown>(
    slug: string,
    params?: Record<string, unknown> | undefined | null,
    resources?: Record<string, string> | undefined | null,
    opts: ClientOptions = {}
  ): Promise<Run<typeof params, Output>> => {
    // While we monkey-patch env vars into the workflow's global, activities run in the main Node.js thread and so have a
    // different set of env vars. We instead pass the required values to initialize the fetcher using the ExecuteOptions
    // object from Workflow -> Activity.
    opts.token = opts.token || process.env.AIRPLANE_TOKEN;
    opts.apiKey = opts.apiKey || process.env.AIRPLANE_API_KEY;
    opts.envID = opts.envID || process.env.AIRPLANE_ENV_ID;
    opts.envSlug = opts.envSlug || process.env.AIRPLANE_ENV_SLUG;
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
};
