import { ClientOptions } from "../api/client";
import { ParamValues, Run } from "../api/types";
import { getRuntime } from "../runtime";

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
): Promise<Run<ParamValues, QueryOutput | undefined | null>> => {
  return getRuntime().execute(
    "airplane:sql_query",
    { query, queryArgs, transactionMode },
    { db: sqlResourceID },
    opts
  );
};
