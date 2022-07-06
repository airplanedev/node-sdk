import { ClientOptions } from "../api/client";
import { ParamValues, Run } from "../api/types";
import { getRuntime } from "../runtime";
import { convertResourceAliasToID } from "./builtins";

export type DocumentOutput = Record<string, unknown>;

export type QueryOptions = {
  filter?: Record<string, unknown> | null;
  projection?: Record<string, unknown> | null;
  sort?: Record<string, unknown> | null;
  client?: ClientOptions;
};

export type UpdateOptions = {
  filter?: Record<string, unknown> | null;
  upsert?: boolean | null;
  client?: ClientOptions;
};

export const find = async (
  mongodbResource: string,
  collection: string,
  opts: QueryOptions & {
    skip?: number | null;
    limit?: number | null;
  } = {}
): Promise<Run<ParamValues, DocumentOutput[] | undefined | null>> => {
  const { filter, projection, sort, skip, limit, client } = opts;
  return getRuntime().execute(
    "airplane:mongodb_find",
    { collection, filter, projection, sort, skip, limit },
    { db: convertResourceAliasToID(mongodbResource) },
    client
  );
};

export const findOne = async (
  mongodbResource: string,
  collection: string,
  opts: QueryOptions = {}
): Promise<Run<ParamValues, DocumentOutput | undefined | null>> => {
  const { filter, projection, sort, client } = opts;
  return getRuntime().execute(
    "airplane:mongodb_findOne",
    { collection, filter, projection, sort },
    { db: convertResourceAliasToID(mongodbResource) },
    client
  );
};

export const findOneAndDelete = async (
  mongodbResource: string,
  collection: string,
  opts: QueryOptions = {}
): Promise<Run<ParamValues, DocumentOutput | undefined | null>> => {
  const { filter, projection, sort, client } = opts;
  return getRuntime().execute(
    "airplane:mongodb_findOneAndDelete",
    { collection, filter, projection, sort },
    { db: convertResourceAliasToID(mongodbResource) },
    client
  );
};

export const findOneAndUpdate = async (
  mongodbResource: string,
  collection: string,
  update: Record<string, unknown>,
  opts: QueryOptions = {}
): Promise<Run<ParamValues, DocumentOutput | undefined | null>> => {
  const { filter, projection, sort, client } = opts;

  return getRuntime().execute(
    "airplane:mongodb_findOneAndUpdate",
    { collection, update, filter, projection, sort },
    { db: convertResourceAliasToID(mongodbResource) },
    client
  );
};

export const findOneAndReplace = async (
  mongodbResource: string,
  collection: string,
  replacement: Record<string, unknown>,
  opts: QueryOptions & UpdateOptions = {}
): Promise<Run<ParamValues, DocumentOutput | undefined | null>> => {
  const { filter, projection, sort, upsert, client } = opts;

  return getRuntime().execute(
    "airplane:mongodb_findOneAndReplace",
    { collection, replacement, filter, projection, sort, upsert },
    { db: convertResourceAliasToID(mongodbResource) },
    client
  );
};

export type InsertOneOutput = {
  InsertedID: string;
};

export const insertOne = async (
  mongodbResource: string,
  collection: string,
  document: Record<string, unknown>,
  opts: { client?: ClientOptions } = {}
): Promise<Run<ParamValues, InsertOneOutput | undefined | null>> => {
  const { client } = opts;
  return getRuntime().execute(
    "airplane:mongodb_insertOne",
    { collection, document },
    { db: convertResourceAliasToID(mongodbResource) },
    client
  );
};

export type InsertManyOutput = {
  InsertedIDs: string[];
};

export const insertMany = async (
  mongodbResource: string,
  collection: string,
  documents: Record<string, unknown>[],
  opts: { client?: ClientOptions } = {}
): Promise<Run<ParamValues, InsertManyOutput | undefined | null>> => {
  const { client } = opts;
  return getRuntime().execute(
    "airplane:mongodb_insertMany",
    { collection, documents },
    { db: convertResourceAliasToID(mongodbResource) },
    client
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
  opts: UpdateOptions = {}
): Promise<Run<ParamValues, UpdateOutput | undefined | null>> => {
  const { filter, upsert, client } = opts;
  return getRuntime().execute(
    "airplane:mongodb_updateOne",
    { collection, update, filter, upsert },
    { db: convertResourceAliasToID(mongodbResource) },
    client
  );
};

export const updateMany = async (
  mongodbResource: string,
  collection: string,
  update: Record<string, unknown>,
  opts: UpdateOptions = {}
): Promise<Run<ParamValues, UpdateOutput | undefined | null>> => {
  const { filter, upsert, client } = opts;
  return getRuntime().execute(
    "airplane:mongodb_updateMany",
    { collection, update, filter, upsert },
    { db: convertResourceAliasToID(mongodbResource) },
    client
  );
};

export type DeleteOutput = {
  DeletedCount: number;
};

export const deleteOne = async (
  mongodbResource: string,
  collection: string,
  filter: Record<string, unknown>,
  opts: { client?: ClientOptions } = {}
): Promise<Run<ParamValues, DeleteOutput | undefined | null>> => {
  const { client } = opts;
  return getRuntime().execute(
    "airplane:mongodb_deleteOne",
    { collection, filter },
    { db: convertResourceAliasToID(mongodbResource) },
    client
  );
};

export const deleteMany = async (
  mongodbResource: string,
  collection: string,
  filter: Record<string, unknown>,
  opts: { client?: ClientOptions } = {}
): Promise<Run<ParamValues, DeleteOutput | undefined | null>> => {
  const { client } = opts;
  return getRuntime().execute(
    "airplane:mongodb_deleteMany",
    { collection, filter },
    { db: convertResourceAliasToID(mongodbResource) },
    client
  );
};

export const aggregate = async (
  mongodbResource: string,
  collection: string,
  pipeline: Record<string, unknown>[],
  opts: { client?: ClientOptions } = {}
): Promise<Run<ParamValues, DocumentOutput[] | undefined | null>> => {
  const { client } = opts;
  return getRuntime().execute(
    "airplane:mongodb_aggregate",
    { collection, pipeline },
    { db: convertResourceAliasToID(mongodbResource) },
    client
  );
};

export type CountOutput = number;

export const countDocuments = async (
  mongodbResource: string,
  collection: string,
  filter: Record<string, unknown>,
  opts: { client?: ClientOptions } = {}
): Promise<Run<ParamValues, CountOutput | undefined | null>> => {
  const { client } = opts;
  return getRuntime().execute(
    "airplane:mongodb_countDocuments",
    { collection, filter },
    { db: convertResourceAliasToID(mongodbResource) },
    client
  );
};

export type DistinctOutput = unknown[];

export const distinct = async (
  mongodbResource: string,
  collection: string,
  field: string,
  filter: Record<string, unknown>,
  opts: { client?: ClientOptions } = {}
): Promise<Run<ParamValues, DistinctOutput | undefined | null>> => {
  const { client } = opts;
  return getRuntime().execute(
    "airplane:mongodb_distinct",
    { collection, field, filter },
    { db: convertResourceAliasToID(mongodbResource) },
    client
  );
};
