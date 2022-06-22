import { ClientOptions } from "../api/client";
import { Run } from "../api/types";
import { runtime } from "../runtime";

export enum TransactionMode {
  Auto = "auto",
  ReadOnly = "readOnly",
  ReadWrite = "readWrite",
  None = "none",
}

export type QueryOutput = Record<string, unknown[]>;

export const query = async (
  sqlResourceID: string,
  query: string,
  queryArgs?: Record<string, unknown> | undefined | null,
  transactionMode: TransactionMode = TransactionMode.Auto,
  opts?: ClientOptions
): Promise<Run<Record<string, unknown> | undefined | null, QueryOutput | undefined | null>> => {
  return runtime.execute(
    "airplane:sql_query",
    { query, queryArgs, transactionMode },
    { db: sqlResourceID },
    opts
  );
};
