import { Client, ClientOptions } from "./api/client";

// Recommended activity factory by Temporal: https://docs.temporal.io/typescript/activities/#important-design-patterns
//
// We re-initialize the client in each activity because there seems to be an issue with Temporal serializing
// classes - the object that is returned by the activity will have no methods associated with it.
export const _registerActivities = () => ({
  executeTaskActivity: async (
    slug: string,
    params: Record<string, unknown> | undefined | null,
    resources: Record<string, string> | undefined | null,
    opts?: ClientOptions
  ): Promise<string> => {
    const client = new Client(opts);
    return client.executeTask(slug, params, resources);
  },
  getRunOutputActivity: async <Output = unknown>(
    runID: string,
    opts?: ClientOptions
  ): Promise<Output> => {
    const client = new Client(opts);
    return client.getRunOutput(runID);
  },
});
