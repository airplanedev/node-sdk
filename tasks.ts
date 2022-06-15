import * as wf from "@temporalio/workflow";
import { proxyActivities } from "@temporalio/workflow";

import type { registerActivities } from "./activities";
import { executeTask, getRunOutput, getFetcher } from "./api";
import { _storage } from "./async";
import { Poller } from "./poll";

const { executeTaskActivity, getRunOutputActivity } = proxyActivities<
  ReturnType<typeof registerActivities>
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

export type ExecuteOptions = {
  host?: string;
  token?: string;
  apiKey?: string;
  envID?: string;
  envSlug?: string;
  source?: string;
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
  // The _storage object will be empty if not executed in the context of a Temporal workflow.
  if (Object.prototype.hasOwnProperty.call(_storage, "enabled")) {
    const store = _storage.getStore();
    if (store != null && store.runtime === "workflow") {
      return durableExecute(slug, params, opts);
    }
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
  params: Record<string, unknown> | undefined | null,
  opts?: ExecuteOptions
): Promise<Run<typeof params, Output>> => {
  const runID = await executeTaskActivity(slug, params, opts);

  // Register termination signal for the workflow. We ensure signal name uniqueness by including the run ID of the task
  // being executed in the signal name, as a workflow task may execute any number of other tasks.
  type runTerminationSignal = {
    taskID: string;
    paramValues: typeof params;
    status: RunStatus;
  };
  const taskSignal = wf.defineSignal<[runTerminationSignal]>(`${runID}-termination`);

  let taskID = "";
  let paramValues: typeof params = undefined;
  let status: RunStatus = RunStatus.NotStarted;
  wf.setHandler(taskSignal, (payload: runTerminationSignal) => {
    taskID = payload.taskID;
    paramValues = payload.paramValues;
    status = payload.status;
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
