import { ClientOptions } from "../api/client";
import { Run } from "../api/types";
import { runtime } from "../runtime";

export enum SQLTransactionMode {
  Auto = "auto",
  ReadOnly = "readOnly",
  ReadWrite = "readWrite",
  None = "none",
}

export type SQLQueryOutput = Record<string, unknown[]>;

export const query = async (
  sqlResourceID: string,
  query: string,
  queryArgs?: Record<string, unknown> | undefined | null,
  transactionMode: SQLTransactionMode = SQLTransactionMode.Auto,
  opts?: ClientOptions
): Promise<Run<Record<string, unknown> | undefined | null, SQLQueryOutput | undefined | null>> => {
  return runtime.execute(
    "airplane:sql_query",
    { query, queryArgs, transactionMode },
    { db: sqlResourceID },
    opts
  );
};
