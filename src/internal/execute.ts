import { ClientOptions } from "./api/client";
import { Run } from "./api/types";
import { getRuntime } from "./runtime";

export const execute = async <Output = unknown>(
  slug: string,
  params?: Record<string, unknown> | undefined | null,
  opts?: ClientOptions
): Promise<Run<typeof params, Output>> => {
  return getRuntime().execute(slug, params, {}, opts);
};
