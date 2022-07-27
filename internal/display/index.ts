import { ClientOptions } from "../api/client";
import { getRuntime } from "../runtime";

export type DisplayOptions = {
  client?: ClientOptions;
};

export const markdown = async (content: string, opts: DisplayOptions = {}): Promise<void> => {
  await getRuntime().display(
    {
      kind: "markdown",
      content,
    },
    opts.client
  );
};
