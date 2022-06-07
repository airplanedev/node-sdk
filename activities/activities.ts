import { Fetcher } from "../fetch";

export const executeTask = async (args: {
  host: string;
  token?: string;
  apiKey?: string;
  slug: string;
  params: Record<string, unknown> | undefined | null;
}): Promise<string> => {
  const fetcher = new Fetcher({
    host: args.host,
    token: args.token,
    apiKey: args.apiKey,
  });

  const { runID } = await fetcher.post<{
    runID: string;
  }>("/v0/tasks/execute", {
    slug: args.slug,
    paramValues: args.params ?? {},
  });

  return runID;
};
