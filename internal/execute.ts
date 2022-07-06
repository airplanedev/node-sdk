import { ClientOptions } from "./api/client";
import { ParamValues, Run, RunStatus } from "./api/types";
import { RunError } from "./errors";
import { getRuntime } from "./runtime";

export const execute = async <Output = unknown>(
  slug: string,
  params: ParamValues = {},
  opts: ClientOptions = {}
): Promise<Run<typeof params, Output>> => {
  const run = await getRuntime().execute<Output>(slug, params, {}, opts);

  if (run.status === RunStatus.Failed || run.status === RunStatus.Cancelled) {
    throw new RunError(run);
  }

  return run;
};
