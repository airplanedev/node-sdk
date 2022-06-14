import { Run, ExecuteOptions, executeInternal } from "./tasks";

export type DocumentRequestOutput = Record<string, unknown>;

export type InsertOneRequestOutput = {
  InsertedID: unknown;
};

export type InsertManyRequestOutput = {
  InsertedIDs: unknown[];
};

export type UpdateRequestOutput = {
  MatchedCount: number;
  ModifiedCount: number;
  UpsertedCount: number;
  UpsertedID: unknown;
};

export type DeleteRequestOutput = {
  DeletedCount: number;
};

export default {
  find: async <Output = DocumentRequestOutput[] | undefined | null>(
    mongodbResourceID: string,
    collection: string,
    filter: Record<string, unknown> | undefined | null = null,
    projection: Record<string, unknown> | undefined | null = null,
    sort: Record<string, unknown> | undefined | null = null,
    skip: number | undefined | null = null,
    limit: number | undefined | null = null,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_find",
      { collection, filter, projection, sort, skip, limit },
      { db: mongodbResourceID },
      opts
    );
  },

  findOne: async <Output = DocumentRequestOutput | undefined | null>(
    mongodbResourceID: string,
    collection: string,
    filter: Record<string, unknown> | undefined | null = null,
    projection: Record<string, unknown> | undefined | null = null,
    sort: Record<string, unknown> | undefined | null = null,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_findOne",
      { collection, filter, projection, sort },
      { db: mongodbResourceID },
      opts
    );
  },

  findOneAndDelete: async <Output = DocumentRequestOutput | undefined | null>(
    mongodbResourceID: string,
    collection: string,
    filter: Record<string, unknown> | undefined | null = null,
    projection: Record<string, unknown> | undefined | null = null,
    sort: Record<string, unknown> | undefined | null = null,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_findOneAndDelete",
      { collection, filter, projection, sort },
      { db: mongodbResourceID },
      opts
    );
  },

  findOneAndUpdate: async <Output = DocumentRequestOutput | undefined | null>(
    mongodbResourceID: string,
    collection: string,
    update: Record<string, unknown>,
    filter: Record<string, unknown> | undefined | null = null,
    projection: Record<string, unknown> | undefined | null = null,
    sort: Record<string, unknown> | undefined | null = null,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_findOneAndUpdate",
      { collection, update, filter, projection, sort },
      { db: mongodbResourceID },
      opts
    );
  },

  findOneAndReplace: async <Output = Document | undefined | null>(
    mongodbResourceID: string,
    collection: string,
    replacement: Record<string, unknown>,
    filter: Record<string, unknown> | undefined | null = null,
    projection: Record<string, unknown> | undefined | null = null,
    sort: Record<string, unknown> | undefined | null = null,
    upsert: boolean | undefined | null = null,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_findOneAndReplace",
      { collection, replacement, filter, projection, sort, upsert },
      { db: mongodbResourceID },
      opts
    );
  },

  insertOne: async <Output = InsertOneRequestOutput | undefined | null>(
    mongodbResourceID: string,
    collection: string,
    document: Record<string, unknown>,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_insertOne",
      { collection, document },
      { db: mongodbResourceID },
      opts
    );
  },

  insertMany: async <Output = InsertManyRequestOutput | undefined | null>(
    mongodbResourceID: string,
    collection: string,
    documents: Record<string, unknown>[],
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_insertMany",
      { collection, documents },
      { db: mongodbResourceID },
      opts
    );
  },

  updateOne: async <Output = UpdateRequestOutput | undefined | null>(
    mongodbResourceID: string,
    collection: string,
    update: Record<string, unknown>,
    filter: Record<string, unknown> | undefined | null = null,
    upsert: boolean | undefined | null = null,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_updateOne",
      { collection, update, filter, upsert },
      { db: mongodbResourceID },
      opts
    );
  },

  updateMany: async <Output = UpdateRequestOutput | undefined | null>(
    mongodbResourceID: string,
    collection: string,
    update: Record<string, unknown>,
    filter: Record<string, unknown> | undefined | null = null,
    upsert: boolean | undefined | null = null,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_updateMany",
      { collection, update, filter, upsert },
      { db: mongodbResourceID },
      opts
    );
  },

  deleteOne: async <Output = DeleteRequestOutput | undefined | null>(
    mongodbResourceID: string,
    collection: string,
    filter: Record<string, unknown>,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_deleteOne",
      { collection, filter },
      { db: mongodbResourceID },
      opts
    );
  },

  deleteMany: async <Output = DeleteRequestOutput>(
    mongodbResourceID: string,
    collection: string,
    filter: Record<string, unknown>,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_deleteMany",
      { collection, filter },
      { db: mongodbResourceID },
      opts
    );
  },

  aggregate: async <Output = DocumentRequestOutput[] | undefined | null>(
    mongodbResourceID: string,
    collection: string,
    pipeline: Record<string, unknown>[],
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_aggregate",
      { collection, pipeline },
      { db: mongodbResourceID },
      opts
    );
  },

  countDocuments: async <Output = number | undefined | null>(
    mongodbResourceID: string,
    collection: string,
    filter: Record<string, unknown>,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_countDocuments",
      { collection, filter },
      { db: mongodbResourceID },
      opts
    );
  },

  distinct: async <Output = unknown[] | undefined | null>(
    mongodbResourceID: string,
    collection: string,
    field: string,
    filter: Record<string, unknown>,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_distinct",
      { collection, field, filter },
      { db: mongodbResourceID },
      opts
    );
  },
};
