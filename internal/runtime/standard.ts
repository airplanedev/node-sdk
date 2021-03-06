import { v4 as uuidv4 } from "uuid";

import { Client, ClientOptions } from "../api/client";
import { Poller } from "../api/poller";
import { isStatusTerminal, ParamSchema, ParamValues, Run } from "../api/types";
import { RuntimeInterface } from "./index";

export const runtime: RuntimeInterface = {
  execute: async <Output = unknown>(
    slug: string,
    params: ParamValues = {},
    resources?: Record<string, string> | undefined | null,
    opts: ClientOptions = {}
  ): Promise<Run<typeof params, Output>> => {
    const client = new Client(opts);

    const runID = await client.executeTask(slug, params, resources);

    // Poll until the run terminates:
    const poller = new Poller({ delayMs: 500 });
    return poller.run(async () => {
      const run = await client.getRun<typeof params>(runID);

      if (!isStatusTerminal(run.status)) {
        return null;
      }

      const output = await client.getRunOutput<Output>(runID);

      return {
        id: run.id,
        taskID: run.taskID,
        paramValues: run.paramValues,
        status: run.status,
        output,
      };
    });
  },

  prompt: async (params: ParamSchema[], opts?: ClientOptions): Promise<ParamValues> => {
    const client = new Client(opts);

    const id = await client.createPrompt(params);

    // Poll until the prompt is submitted:
    const poller = new Poller({ delayMs: 500 });
    return poller.run(async () => {
      const prompt = await client.getPrompt(id);

      if (prompt.submittedAt == null) {
        return null;
      }

      return prompt.values;
    });
  },

  logChunks: (output: string): void => {
    const CHUNK_SIZE = 8192;
    if (output.length <= CHUNK_SIZE) {
      console.log(output);
    } else {
      const chunkKey = uuidv4();
      for (let i = 0; i < output.length; i += CHUNK_SIZE) {
        console.log(`airplane_chunk:${chunkKey} ${output.substring(i, i + CHUNK_SIZE)}`);
      }
      console.log(`airplane_chunk_end:${chunkKey}`);
    }
  },
};
