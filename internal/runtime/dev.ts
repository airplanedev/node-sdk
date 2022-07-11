import { Client, ClientOptions } from "../api/client";
import { ParamSchema, ParamValues, Run } from "../api/types";
import { RuntimeInterface } from "./index";
import { runtime as standardRuntime } from "./standard";

export const runtime: RuntimeInterface = {
  execute: async <Output = unknown>(
    slug: string,
    params: ParamValues = {},
    resources?: Record<string, string> | undefined | null,
    opts: ClientOptions = {}
  ): Promise<Run<typeof params, Output>> => {
    const client = new Client(opts);

    const runID = await client.executeTask(slug, params, resources);
    const run = await client.getRun<typeof params>(runID);
    const output = await client.getRunOutput<Output>(runID);

    return {
      id: run.id,
      taskID: run.taskID,
      paramValues: run.paramValues,
      status: run.status,
      output,
    };
  },

  prompt: async (params: ParamSchema[], opts?: ClientOptions): Promise<ParamValues> => {
    return standardRuntime.prompt(params, opts);
  },

  logChunks: (output: string): void => {
    return standardRuntime.logChunks(output);
  },
};
