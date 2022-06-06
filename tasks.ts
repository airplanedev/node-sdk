import { Fetcher } from "./fetch";
import { Poller } from "./poll";

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
  params?: Record<string, unknown> | undefined | null
): Promise<Run<typeof params, Output>> => {
  const fetcher = new Fetcher({
    host: process.env.AIRPLANE_API_HOST ?? "",
    token: process.env.AIRPLANE_TOKEN ?? "",
    envID: process.env.AIRPLANE_ENV_ID ?? "",
  });

  const { runID } = await fetcher.post<{
    runID: string;
  }>("/v0/tasks/execute", {
    slug,
    paramValues: params ?? {},
  });

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

    const { output } = await fetcher.get<{ output: Output }>("/v0/runs/getOutputs", { id: runID });

    return {
      id: run.id,
      taskID: run.taskID,
      paramValues: run.paramValues,
      status: run.status,
      output,
    };
  });
};
