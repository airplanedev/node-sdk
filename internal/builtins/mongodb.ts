import { ClientOptions } from "../api/client";
import { ParamValues, Run } from "../api/types";
import { getRuntime } from "../runtime";
import { convertResourceAliasToID } from "./builtins";

export type DocumentOutput = Record<string, unknown>;

export const find = async (
  mongodbResource: string,
  collection: string,
  params?: {
    filter: Record<string, unknown> | undefined | null;
    projection: Record<string, unknown> | undefined | null;
    sort: Record<string, unknown> | undefined | null;
    skip: number | undefined | null;
    limit: number | undefined | null;
  },
  opts?: ClientOptions
): Promise<Run<ParamValues, DocumentOutput[] | undefined | null>> => {
  const { filter = null, projection = null, sort = null, skip = null, limit = null } = params || {};
  return getRuntime().execute(
    "airplane:mongodb_find",
    { collection, filter, projection, sort, skip, limit },
    { db: convertResourceAliasToID(mongodbResource) },
    opts
  );
};

export type Params = {
  filter: Record<string, unknown> | undefined | null;
  projection: Record<string, unknown> | undefined | null;
  sort: Record<string, unknown> | undefined | null;
};

export const findOne = async (
  mongodbResource: string,
  collection: string,
  params?: Params,
  opts?: ClientOptions
): Promise<Run<ParamValues, DocumentOutput | undefined | null>> => {
  const { filter = null, projection = null, sort = null } = params || {};
  return getRuntime().execute(
    "airplane:mongodb_findOne",
    { collection, filter, projection, sort },
    { db: convertResourceAliasToID(mongodbResource) },
    opts
  );
};

export const findOneAndDelete = async (
  mongodbResource: string,
  collection: string,
  params?: Params,
  opts?: ClientOptions
): Promise<Run<ParamValues, DocumentOutput | undefined | null>> => {
  const { filter = null, projection = null, sort = null } = params || {};
  return getRuntime().execute(
    "airplane:mongodb_findOneAndDelete",
    { collection, filter, projection, sort },
    { db: convertResourceAliasToID(mongodbResource) },
    opts
  );
};

export const findOneAndUpdate = async (
  mongodbResource: string,
  collection: string,
  update: Record<string, unknown>,
  params?: Params,
  opts?: ClientOptions
): Promise<Run<ParamValues, DocumentOutput | undefined | null>> => {
  const { filter = null, projection = null, sort = null } = params || {};

  return getRuntime().execute(
    "airplane:mongodb_findOneAndUpdate",
    { collection, update, filter, projection, sort },
    { db: convertResourceAliasToID(mongodbResource) },
    opts
  );
};

export const findOneAndReplace = async (
  mongodbResource: string,
  collection: string,
  replacement: Record<string, unknown>,
  params?: {
    filter: Record<string, unknown> | undefined | null;
    projection: Record<string, unknown> | undefined | null;
    sort: Record<string, unknown> | undefined | null;
    upsert: boolean | undefined | null;
  },
  opts?: ClientOptions
): Promise<Run<ParamValues, DocumentOutput | undefined | null>> => {
  const { filter = null, projection = null, sort = null, upsert = null } = params || {};

  return getRuntime().execute(
    "airplane:mongodb_findOneAndReplace",
    { collection, replacement, filter, projection, sort, upsert },
    { db: convertResourceAliasToID(mongodbResource) },
    opts
  );
};

export type InsertOneOutput = {
  InsertedID: string;
};

export const insertOne = async (
  mongodbResource: string,
  collection: string,
  document: Record<string, unknown>,
  opts?: ClientOptions
): Promise<Run<ParamValues, InsertOneOutput | undefined | null>> => {
  return getRuntime().execute(
    "airplane:mongodb_insertOne",
    { collection, document },
    { db: convertResourceAliasToID(mongodbResource) },
    opts
  );
};

export type InsertManyOutput = {
  InsertedIDs: string[];
};

export const insertMany = async (
  mongodbResource: string,
  collection: string,
  documents: Record<string, unknown>[],
  opts?: ClientOptions
): Promise<Run<ParamValues, InsertManyOutput | undefined | null>> => {
  return getRuntime().execute(
    "airplane:mongodb_insertMany",
    { collection, documents },
    { db: convertResourceAliasToID(mongodbResource) },
    opts
  );
};

export type UpdateOutput = {
  MatchedCount: number;
  ModifiedCount: number;
  UpsertedCount: number;
  UpsertedID: string;
};

export const updateOne = async (
  mongodbResource: string,
  collection: string,
  update: Record<string, unknown>,
  params?: {
    filter: Record<string, unknown> | undefined | null;
    upsert: boolean | undefined | null;
  },
  opts?: ClientOptions
): Promise<Run<ParamValues, UpdateOutput | undefined | null>> => {
  const { filter = null, upsert = null } = params || {};
  return getRuntime().execute(
    "airplane:mongodb_updateOne",
    { collection, update, filter, upsert },
    { db: convertResourceAliasToID(mongodbResource) },
    opts
  );
};

export const updateMany = async (
  mongodbResource: string,
  collection: string,
  update: Record<string, unknown>,
  params?: {
    filter: Record<string, unknown> | undefined | null;
    upsert: boolean | undefined | null;
  },
  opts?: ClientOptions
): Promise<Run<ParamValues, UpdateOutput | undefined | null>> => {
  const { filter = null, upsert = null } = params || {};
  return getRuntime().execute(
    "airplane:mongodb_updateMany",
    { collection, update, filter, upsert },
    { db: convertResourceAliasToID(mongodbResource) },
    opts
  );
};

export type DeleteOutput = {
  DeletedCount: number;
};

export const deleteOne = async (
  mongodbResource: string,
  collection: string,
  filter: Record<string, unknown>,
  opts?: ClientOptions
): Promise<Run<ParamValues, DeleteOutput | undefined | null>> => {
  return getRuntime().execute(
    "airplane:mongodb_deleteOne",
    { collection, filter },
    { db: convertResourceAliasToID(mongodbResource) },
    opts
  );
};

export const deleteMany = async (
  mongodbResource: string,
  collection: string,
  filter: Record<string, unknown>,
  opts?: ClientOptions
): Promise<Run<ParamValues, DeleteOutput | undefined | null>> => {
  return getRuntime().execute(
    "airplane:mongodb_deleteMany",
    { collection, filter },
    { db: convertResourceAliasToID(mongodbResource) },
    opts
  );
};

export const aggregate = async (
  mongodbResource: string,
  collection: string,
  pipeline: Record<string, unknown>[],
  opts?: ClientOptions
): Promise<Run<ParamValues, DocumentOutput[] | undefined | null>> => {
  return getRuntime().execute(
    "airplane:mongodb_aggregate",
    { collection, pipeline },
    { db: convertResourceAliasToID(mongodbResource) },
    opts
  );
};

export type CountOutput = number;

export const countDocuments = async (
  mongodbResource: string,
  collection: string,
  filter: Record<string, unknown>,
  opts?: ClientOptions
): Promise<Run<ParamValues, CountOutput | undefined | null>> => {
  return getRuntime().execute(
    "airplane:mongodb_countDocuments",
    { collection, filter },
    { db: convertResourceAliasToID(mongodbResource) },
    opts
  );
};

export type DistinctOutput = unknown[];

export const distinct = async (
  mongodbResource: string,
  collection: string,
  field: string,
  filter: Record<string, unknown>,
  opts?: ClientOptions
): Promise<Run<ParamValues, DistinctOutput | undefined | null>> => {
  return getRuntime().execute(
    "airplane:mongodb_distinct",
    { collection, field, filter },
    { db: convertResourceAliasToID(mongodbResource) },
    opts
  );
};
