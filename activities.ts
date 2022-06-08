import { executeTask, getRunOutput, getFetcher } from "./api";
import { ExecuteOptions } from "./tasks";

// Recommended activity factory by Temporal: https://docs.temporal.io/typescript/activities/#important-design-patterns
export const registerActivities = () => ({
  executeTaskActivity: async (
    slug: string,
    params: Record<string, unknown> | undefined | null,
    opts?: ExecuteOptions
  ): Promise<string> => {
    // We re-initialize the fetcher in each activity because there seems to be an issue with Temporal serializing
    // classes - the object that is returned by the activity will have no methods associated with it.
    const fetcher = getFetcher(opts);
    return executeTask(fetcher, slug, params);
  },
  getRunOutputActivity: async <Output = unknown>(
    runID: string,
    opts?: ExecuteOptions
  ): Promise<Output> => {
    const fetcher = getFetcher(opts);
    return getRunOutput(fetcher, runID);
  },
});
