import { ParamValues, Run } from "./api/types";

export class RunTerminationError<
  TParamValues extends ParamValues = ParamValues,
  TOutput = unknown
> extends Error {
  constructor(public readonly run: Run<TParamValues, TOutput>) {
    super(`Run ${run.status.toLowerCase()}`);
    this.name = "RunTerminationError";
  }
}
