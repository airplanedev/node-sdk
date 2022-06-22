export enum RunStatus {
  NotStarted = "NotStarted",
  Queued = "Queued",
  Active = "Active",
  Succeeded = "Succeeded",
  Failed = "Failed",
  Cancelled = "Cancelled",
}

export type Run<Input = unknown, Output = unknown> = {
  id: string;
  taskID: string;
  paramValues: Input;
  status: RunStatus;
  output: Output;
};

export const isStatusTerminal = (status: RunStatus): boolean => {
  switch (status) {
    case (RunStatus.Succeeded, RunStatus.Failed, RunStatus.Cancelled):
      return true;
    default:
      return false;
  }
};
