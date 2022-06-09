import * as wf from "@temporalio/workflow";
import { proxyActivities } from "@temporalio/workflow";

import type { registerActivities } from "./activities";
import { executeTask, getRunOutput, getFetcher } from "./api";
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
  runtime?: string;
};

export const execute = async <Output = unknown>(
  slug: string,
  params?: Record<string, unknown> | undefined | null,
  opts?: ExecuteOptions
): Promise<Run<typeof params, Output>> => {
  if (opts?.runtime === "workflow") {
    return durableExecute(slug, params, opts);
  }

  const fetcher = getFetcher(opts);
  const runID = await executeTask(fetcher, slug, params);

  // Poll until the run terminates:
  const poller = new Poller({ delayMs: 500 });
  return poller.run(async () => {
    const run = await fetcher.get<{
      id: string;
      status: RunStatus;
      paramValues: typeof params;
      taskID: string;
    }>("/v0/runs/get", { id: runID });

    if (!terminalStatuses.includes(run.status)) {
      return null;
    }

    const output = await getRunOutput<Output>(fetcher, runID);

    return {
      id: run.id,
      taskID: run.taskID,
      paramValues: run.paramValues,
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
  const authnTokenSignal = wf.defineSignal<[string]>(`authn-token`);
  wf.setHandler(authnTokenSignal, (authnToken: string) => {
    if (opts != null) {
      opts.token = opts.token ?? authnToken;
    }
  });

  const runID = await executeTaskActivity(slug, params, opts);

  // Register termination signal for the workflow. We ensure signal name uniqueness by including the run ID of the task
  // being executed in the signal name, as a workflow task may execute any number of other tasks.
  // Note: the properties of the signal type below must be capitalized due to limitations in other Temporal SDKs. For
  // example, in Go, a signal field must be public in order for Temporal to properly serialize it:
  // https://docs.temporal.io/go/how-to-use-signals-in-go/#define-signal-type
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
