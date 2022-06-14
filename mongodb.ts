import { Run, ExecuteOptions, executeInternal } from "./tasks";

export default {
  find: async <Output = unknown>(
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

  findOne: async <Output = unknown>(
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

  findOneAndDelete: async <Output = unknown>(
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

  findOneAndUpdate: async <Output = unknown>(
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

  findOneAndReplace: async <Output = unknown>(
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

  insertOne: async <Output = unknown>(
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

  insertMany: async <Output = unknown>(
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

  updateOne: async <Output = unknown>(
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

  updateMany: async <Output = unknown>(
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

  deleteOne: async <Output = unknown>(
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

  deleteMany: async <Output = unknown>(
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

  aggregate: async <Output = unknown>(
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

  countDocuments: async <Output = unknown>(
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

  distinct: async <Output = unknown>(
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
