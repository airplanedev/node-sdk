import { Fetcher } from "./fetcher";
import { ParamSchema, Prompt, RunStatus } from "./types";

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

  constructor(opts: ClientOptions = {}) {
    const env = globalThis.process?.env;
    const host = opts.host || env?.AIRPLANE_API_HOST || "";
    const token = opts.token || env?.AIRPLANE_TOKEN;
    const apiKey = opts.apiKey || env?.AIRPLANE_API_KEY;
    const envID = opts.envID || env?.AIRPLANE_ENV_ID;
    const envSlug = opts.envSlug || env?.AIRPLANE_ENV_SLUG;
    const source = opts.source || "sdk/node";

    this.fetcher = new Fetcher({
      host,
      token,
      apiKey,
      envID,
      envSlug,
      source,
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

  async getRunOutput<O = unknown>(runID: string): Promise<O> {
    const { output } = await this.fetcher.get<{ output: O }>("/v0/runs/getOutputs", {
      id: runID,
    });

    return output;
  }

  async getRun<P = unknown>(runID: string) {
    return this.fetcher.get<{
      id: string;
      status: RunStatus;
      paramValues: P;
      taskID: string;
    }>("/v0/runs/get", { id: runID });
  }

  async createPrompt(params: ParamSchema[]): Promise<string> {
    const resp = await this.fetcher.post<{
      id: string;
    }>("/v0/prompts/create", { schema: { parameters: params } });
    return resp.id;
  }

  async getPrompt(id: string): Promise<Prompt> {
    const resp = await this.fetcher.get<{
      prompt: Prompt;
    }>("/v0/prompts/get", { id });
    return resp.prompt;
  }
}
