import { executeTask, getRunOutput, getFetcher } from "./api";
import { ExecuteOptions } from "./tasks";

// Recommended activity factory by Temporal: https://docs.temporal.io/typescript/activities/#important-design-patterns
export const registerActivities = () => ({
  executeTaskActivity: async (
    slug: string,
    params: Record<string, unknown> | undefined | null,
    opts?: ExecuteOptions
  ): Promise<string> => {
    // We re-initialize the fetcher in each activity because there is an issue with Temporal proxy activities where it
    // strips the methods of any return values.
    const fetcher = getFetcher(opts);
    return await executeTask(fetcher, slug, params);
  },
  getRunOutputActivity: async <Output = unknown>(
    runID: string,
    opts?: ExecuteOptions
  ): Promise<Output> => {
    const fetcher = getFetcher(opts);
    return await getRunOutput(fetcher, runID);
  },
});
