// This file contains various utility methods used by both standard and workflow tasks. This means that the Temporal
// activities defined in activities/activities.ts are essentially wrappers around the methods below.

import { Fetcher } from "./fetch";
import { ExecuteOptions } from "./tasks";

export const getFetcher = (opts?: ExecuteOptions): Fetcher => {
  const env = typeof process === "undefined" ? {} : process?.env;
  const host = opts?.host || env?.AIRPLANE_API_HOST || "";
  const token = opts?.token || env?.AIRPLANE_TOKEN;
  const apiKey = opts?.apiKey || env?.AIRPLANE_API_KEY;
  const envID = opts?.envID || env?.AIRPLANE_ENV_ID;

  return new Fetcher({
    host,
    token,
    apiKey,
    envID,
  });
};

export const executeTask = async (
  fetcher: Fetcher,
  slug: string,
  params: Record<string, unknown> | undefined | null
): Promise<string> => {
  const { runID } = await fetcher.post<{
    runID: string;
  }>("/v0/tasks/execute", {
    slug: slug,
    paramValues: params ?? {},
  });

  return runID;
};

export const fetchTaskOutput = async <Output = unknown>(
  fetcher: Fetcher,
  runID: string
): Promise<Output> => {
  const { output } = await fetcher.get<{ output: Output }>("/v0/runs/getOutputs", {
    id: runID,
  });

  return output;
};
