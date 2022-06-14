import { executeTask, getRunOutput, getFetcher, ExecuteOptions } from "./api";

// Recommended activity factory by Temporal: https://docs.temporal.io/typescript/activities/#important-design-patterns
export const _registerActivities = () => ({
  executeTaskActivity: async (
    slug: string,
    params: Record<string, unknown> | undefined | null,
    resources: Record<string, string> | undefined | null,
    opts?: ExecuteOptions
  ): Promise<string> => {
    // We re-initialize the fetcher in each activity because there seems to be an issue with Temporal serializing
    // classes - the object that is returned by the activity will have no methods associated with it.
    const fetcher = getFetcher(opts);
    return executeTask(fetcher, slug, params, resources);
  },
  getRunOutputActivity: async <Output = unknown>(
    runID: string,
    opts?: ExecuteOptions
  ): Promise<Output> => {
    const fetcher = getFetcher(opts);
    return getRunOutput(fetcher, runID);
  },
});
