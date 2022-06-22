import { Fetcher } from "./fetcher";
import { RunStatus } from "./types";

export type ClientOptions = {
  host?: string;
  token?: string;
  apiKey?: string;
  envID?: string;
  envSlug?: string;
  source?: string;
};

export class Client {
  private readonly fetcher: Fetcher;

  constructor(opts?: ClientOptions) {
    const env = globalThis.process?.env;
    const host = opts?.host || env?.AIRPLANE_API_HOST || "";
    const token = opts?.token || env?.AIRPLANE_TOKEN;
    const apiKey = opts?.apiKey || env?.AIRPLANE_API_KEY;
    const envID = opts?.envID || env?.AIRPLANE_ENV_ID;
    const envSlug = opts?.envSlug || env?.AIRPLANE_ENV_SLUG;

    this.fetcher = new Fetcher({
      host,
      token,
      apiKey,
      envID,
      envSlug,
      source: opts?.source,
    });
  }

  async executeTask(
    slug: string,
    params: Record<string, unknown> | undefined | null,
    resources: Record<string, string> | undefined | null
  ): Promise<string> {
    const { runID } = await this.fetcher.post<{
      runID: string;
    }>("/v0/tasks/execute", {
      slug: slug,
      paramValues: params ?? {},
      resources: resources ?? {},
    });

    return runID;
  }

  async getRunOutput<Output = unknown>(runID: string): Promise<Output> {
    const { output } = await this.fetcher.get<{ output: Output }>("/v0/runs/getOutputs", {
      id: runID,
    });

    return output;
  }

  async getRun<ParamValues = unknown>(runID: string) {
    return this.fetcher.get<{
      id: string;
      status: RunStatus;
      paramValues: ParamValues;
      taskID: string;
      isStdAPI: boolean;
      stdAPIRequest: {
        request: ParamValues;
      };
    }>("/v0/runs/get", { id: runID });
  }
}
