import { ClientOptions } from "../api/client";
import { Run } from "../api/types";
import { getRuntime } from "../runtime";

export const message = async (
  channelName: string,
  message: string,
  opts?: ClientOptions
): Promise<Run<Record<string, unknown> | undefined | null, undefined | null>> => {
  return getRuntime().execute(
    "airplane:slack_message",
    { channelName, message },
    { slack: "res00000000zteamslack" },
    opts
  );
};
