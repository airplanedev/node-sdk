import { Client, ClientOptions } from "../api/client";
import { Poller } from "../api/poller";
import { isStatusTerminal, Run } from "../api/types";
import { RuntimeInterface } from "./index";

export const runtime: RuntimeInterface = {
  execute: async <Output = unknown>(
    slug: string,
    params?: Record<string, unknown> | undefined | null,
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

      let paramValues = run.paramValues;
      if (run.isStdAPI) {
        paramValues = run.stdAPIRequest.request;
      }
      return {
        id: run.id,
        taskID: run.taskID,
        paramValues: paramValues,
        status: run.status,
        output,
      };
    });
  },
};
