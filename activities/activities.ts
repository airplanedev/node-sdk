import { ExecuteOptions } from "../tasks";
import { executeTask, fetchTaskOutput, getFetcher } from "../tasks_utils";

export const executeTaskActivity = async (
  slug: string,
  params: Record<string, unknown> | undefined | null,
  opts?: ExecuteOptions
): Promise<string> => {
  // We re-initialize the fetcher in each activity because there is an issue with Temporal proxy activities where it
  // strips the methods of any return values.
  const fetcher = getFetcher(opts);
  return await executeTask(fetcher, slug, params);
};

export const fetchTaskOutputActivity = async <Output = unknown>(
  runID: string,
  opts?: ExecuteOptions
): Promise<Output> => {
  const fetcher = getFetcher(opts);
  return fetchTaskOutput(fetcher, runID);
};
