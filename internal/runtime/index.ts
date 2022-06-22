import { ClientOptions } from "../api/client";
import { Run } from "../api/types";
import { runtime as standardRuntime } from "./standard";
import { runtime as workflowRuntime } from "./workflow";

export type RuntimeInterface = {
  execute<Output = unknown>(
    slug: string,
    params?: Record<string, unknown> | undefined | null,
    resources?: Record<string, string> | undefined | null,
    opts?: ClientOptions
  ): Promise<Run<typeof params, Output>>;
};

export enum RuntimeKind {
  Standard = "standard",
  Workflow = "workflow",
}

export const getRuntime = () => {
  const kind = globalThis.process?.env.AIRPLANE_RUNTIME;
  return kind === RuntimeKind.Workflow ? workflowRuntime : standardRuntime;
};
