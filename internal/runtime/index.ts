import { ClientOptions } from "../api/client";
import { ParamSchema, ParamValues, Run } from "../api/types";
import { runtime as devRuntime } from "./dev";
import { runtime as standardRuntime } from "./standard";
import { runtime as workflowRuntime } from "./workflow";

export type RuntimeInterface = {
  execute<Output = unknown>(
    slug: string,
    params: ParamValues,
    resources?: Record<string, string> | undefined | null,
    opts?: ClientOptions
  ): Promise<Run<typeof params, Output>>;

  prompt(params: ParamSchema[], opts?: ClientOptions): Promise<ParamValues>;

  logChunks(output: string): void;
};

export enum RuntimeKind {
  Standard = "standard",
  Workflow = "workflow",
  Dev = "dev",
}

export const getRuntime = () => {
  const kind = globalThis.process?.env.AIRPLANE_RUNTIME;
  switch (kind) {
    case RuntimeKind.Workflow:
      return workflowRuntime;
    case RuntimeKind.Dev:
      return devRuntime;
    default:
      return standardRuntime;
  }
};
