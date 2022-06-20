import { ClientOptions } from "./api/client";
import { Run } from "./api/types";
import { runtime } from "./runtime";

export const execute = async <Output = unknown>(
  slug: string,
  params?: Record<string, unknown> | undefined | null,
  opts?: ClientOptions
): Promise<Run<typeof params, Output>> => {
  return runtime.execute(slug, params, {}, opts);
};
