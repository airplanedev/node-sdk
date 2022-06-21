import { ClientOptions } from "../api/client";
import { Run } from "../api/types";
import { runtime as standardRuntime } from "./standard";
import { runtime as workflowRuntime } from "./standard";

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

const env = typeof process === "undefined" ? {} : process?.env;
export const runtime =
  env?.AIRPLANE_RUNTIME === RuntimeKind.Workflow ? workflowRuntime : standardRuntime;
