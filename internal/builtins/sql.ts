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

export type InputOptions = {
  queryArgs?: Record<string, unknown> | undefined | null;
  transactionMode?: TransactionMode;
  client?: ClientOptions;
};

export const query = async (
  sqlResource: string,
  query: string,
  opts?: InputOptions
): Promise<Run<ParamValues, QueryOutput | undefined | null>> => {
  const { queryArgs, transactionMode = TransactionMode.Auto, client } = opts || {};
  return getRuntime().execute(
    "airplane:sql_query",
    { query, queryArgs, transactionMode },
    { db: convertResourceAliasToID(sqlResource) },
    client
  );
};
