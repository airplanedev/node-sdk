import { Run, ExecuteOptions, executeInternal } from "./tasks";

export enum TransactionMode {
  Auto = "auto",
  ReadOnly = "readOnly",
  ReadWrite = "readWrite",
  None = "none",
}

export default {
  TransactionMode,

  query: async <Output = unknown>(
    sql_resource_id: string,
    query: string,
    queryArgs?: Record<string, unknown> | undefined | null,
    transactionMode: TransactionMode = TransactionMode.Auto,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:sql_query",
      { query, queryArgs, transactionMode },
      { db: sql_resource_id },
      opts
    );
  },
};
