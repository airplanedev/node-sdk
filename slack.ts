import { Run, ExecuteOptions, executeInternal } from "./tasks";

export default {
  query: async <Output = unknown>(
    slack_resource_id: string,
    channelName: string,
    message: string,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:slack_message",
      { channelName, message },
      { slack: slack_resource_id },
      opts
    );
  },
};
