import { Run, ExecuteOptions, executeInternal } from "./tasks";

export default {
  find: async <Output = unknown>(
    mongodb_resource_id: string,
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
      { mongodb_resource_id },
      opts
    );
  },

  findOne: async <Output = unknown>(
    mongodb_resource_id: string,
    collection: string,
    filter: Record<string, unknown> | undefined | null = null,
    projection: Record<string, unknown> | undefined | null = null,
    sort: Record<string, unknown> | undefined | null = null,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_findOne",
      { collection, filter, projection, sort },
      { mongodb_resource_id },
      opts
    );
  },

  findOneAndDelete: async <Output = unknown>(
    mongodb_resource_id: string,
    collection: string,
    filter: Record<string, unknown> | undefined | null = null,
    projection: Record<string, unknown> | undefined | null = null,
    sort: Record<string, unknown> | undefined | null = null,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_findOneAndDelete",
      { collection, filter, projection, sort },
      { mongodb_resource_id },
      opts
    );
  },

  findOneAndUpdate: async <Output = unknown>(
    mongodb_resource_id: string,
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
      { mongodb_resource_id },
      opts
    );
  },

  findOneAndReplace: async <Output = unknown>(
    mongodb_resource_id: string,
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
      { mongodb_resource_id },
      opts
    );
  },

  insertOne: async <Output = unknown>(
    mongodb_resource_id: string,
    collection: string,
    document: Record<string, unknown>,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_insertOne",
      { collection, document },
      { mongodb_resource_id },
      opts
    );
  },

  insertMany: async <Output = unknown>(
    mongodb_resource_id: string,
    collection: string,
    documents: Record<string, unknown>[],
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_insertMany",
      { collection, documents },
      { mongodb_resource_id },
      opts
    );
  },

  updateOne: async <Output = unknown>(
    mongodb_resource_id: string,
    collection: string,
    update: Record<string, unknown>,
    filter: Record<string, unknown> | undefined | null = null,
    upsert: boolean | undefined | null = null,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_updateOne",
      { collection, update, filter, upsert },
      { mongodb_resource_id },
      opts
    );
  },

  updateMany: async <Output = unknown>(
    mongodb_resource_id: string,
    collection: string,
    update: Record<string, unknown>,
    filter: Record<string, unknown> | undefined | null = null,
    upsert: boolean | undefined | null = null,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_updateMany",
      { collection, update, filter, upsert },
      { mongodb_resource_id },
      opts
    );
  },

  deleteOne: async <Output = unknown>(
    mongodb_resource_id: string,
    collection: string,
    filter: Record<string, unknown>,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_deleteOne",
      { collection, filter },
      { mongodb_resource_id },
      opts
    );
  },

  deleteMany: async <Output = unknown>(
    mongodb_resource_id: string,
    collection: string,
    filter: Record<string, unknown>,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_deleteMany",
      { collection, filter },
      { mongodb_resource_id },
      opts
    );
  },

  aggregate: async <Output = unknown>(
    mongodb_resource_id: string,
    collection: string,
    pipeline: Record<string, unknown>[],
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_aggregate",
      { collection, pipeline },
      { mongodb_resource_id },
      opts
    );
  },

  countDocuments: async <Output = unknown>(
    mongodb_resource_id: string,
    collection: string,
    filter: Record<string, unknown>,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_countDocuments",
      { collection, filter },
      { mongodb_resource_id },
      opts
    );
  },

  distinct: async <Output = unknown>(
    mongodb_resource_id: string,
    collection: string,
    field: string,
    filter: Record<string, unknown>,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:mongodb_distinct",
      { collection, field, filter },
      { mongodb_resource_id },
      opts
    );
  },
};
