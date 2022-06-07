import { Fetcher } from "../fetch";
import { ExecuteOptions } from "../tasks";

export const executeTask = async (args: {
  opts?: ExecuteOptions;
  slug: string;
  params: Record<string, unknown> | undefined | null;
}): Promise<string> => {
  console.log("inside execute task activity");
  const host = args.opts?.host || process?.env?.AIRPLANE_API_HOST || "";
  const token = args.opts?.token || process?.env?.AIRPLANE_TOKEN;
  const apiKey = args.opts?.apiKey || process?.env?.AIRPLANE_API_KEY;

  const fetcher = new Fetcher({
    host,
    token,
    apiKey,
  });

  const { runID } = await fetcher.post<{
    runID: string;
  }>("/v0/tasks/execute", {
    slug: args.slug,
    paramValues: args.params ?? {},
  });

  return runID;
};

export const fetchTaskOutput = async <Output = unknown>(args: {
  opts?: ExecuteOptions;
  runID: string;
}): Promise<Output> => {
  const host = args.opts?.host || process?.env?.AIRPLANE_API_HOST || "";
  const token = args.opts?.token || process?.env?.AIRPLANE_TOKEN;
  const apiKey = args.opts?.apiKey || process?.env?.AIRPLANE_API_KEY;

  const fetcher = new Fetcher({
    host,
    token,
    apiKey,
  });

  const { output } = await fetcher.get<{ output: Output }>("/v0/runs/getOutputs", {
    id: args.runID,
  });

  return output;
};
