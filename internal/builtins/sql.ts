import { ClientOptions } from "../api/client";
import { ParamValues, Run } from "../api/types";
import { getRuntime } from "../runtime";
import { convertResourceAliasToID } from "./builtins";

export enum TransactionMode {
  Auto = "auto",
  ReadOnly = "readOnly",
  ReadWrite = "readWrite",
  None = "none",
}

export type QueryOutput = Record<string, unknown[]>;

export type QueryOptions = {
  args?: Record<string, unknown> | null;
  transactionMode?: TransactionMode | null;
  client?: ClientOptions;
};

export const query = async (
  sqlResource: string,
  query: string,
  opts: QueryOptions = {}
): Promise<Run<ParamValues, QueryOutput | undefined | null>> => {
  const { args, transactionMode, client } = opts;
  return getRuntime().execute(
    "airplane:sql_query",
    { query, args, transactionMode: transactionMode ?? TransactionMode.Auto },
    { db: convertResourceAliasToID(sqlResource) },
    client
  );
};
