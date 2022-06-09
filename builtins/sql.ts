import { Run, execute } from "tasks";

export enum TransactionMode {
  Auto = "auto",
  ReadOnly = "readOnly",
  ReadWrite = "readWrite",
  None = "none",
}

export const sql = {
  TransactionMode,

  query: async <Output = unknown>(
    query: string,
    db: string,
    queryArgs?: Record<string, unknown> | undefined | null,
    transactionMode: TransactionMode = TransactionMode.Auto
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return execute("airplane:sql_query", { query, queryArgs, transactionMode }, { db });
  },
};
