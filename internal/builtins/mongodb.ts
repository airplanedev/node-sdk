import { ClientOptions } from "../api/client";
import { Run } from "../api/types";
import { getRuntime } from "../runtime";

export type DocumentOutput = Record<string, unknown>;

export const find = async (
  mongodbResourceID: string,
  collection: string,
  filter: Record<string, unknown> | undefined | null = null,
  projection: Record<string, unknown> | undefined | null = null,
  sort: Record<string, unknown> | undefined | null = null,
  skip: number | undefined | null = null,
  limit: number | undefined | null = null,
  opts?: ClientOptions
): Promise<
  Run<Record<string, unknown> | undefined | null, DocumentOutput[] | undefined | null>
> => {
  return getRuntime().execute(
    "airplane:mongodb_find",
    { collection, filter, projection, sort, skip, limit },
    { db: mongodbResourceID },
    opts
  );
};

export const findOne = async (
  mongodbResourceID: string,
  collection: string,
  filter: Record<string, unknown> | undefined | null = null,
  projection: Record<string, unknown> | undefined | null = null,
  sort: Record<string, unknown> | undefined | null = null,
  opts?: ClientOptions
): Promise<Run<Record<string, unknown> | undefined | null, DocumentOutput | undefined | null>> => {
  return getRuntime().execute(
    "airplane:mongodb_findOne",
    { collection, filter, projection, sort },
    { db: mongodbResourceID },
    opts
  );
};

export const findOneAndDelete = async (
  mongodbResourceID: string,
  collection: string,
  filter: Record<string, unknown> | undefined | null = null,
  projection: Record<string, unknown> | undefined | null = null,
  sort: Record<string, unknown> | undefined | null = null,
  opts?: ClientOptions
): Promise<Run<Record<string, unknown> | undefined | null, DocumentOutput | undefined | null>> => {
  return getRuntime().execute(
    "airplane:mongodb_findOneAndDelete",
    { collection, filter, projection, sort },
    { db: mongodbResourceID },
    opts
  );
};

export const findOneAndUpdate = async (
  mongodbResourceID: string,
  collection: string,
  update: Record<string, unknown>,
  filter: Record<string, unknown> | undefined | null = null,
  projection: Record<string, unknown> | undefined | null = null,
  sort: Record<string, unknown> | undefined | null = null,
  opts?: ClientOptions
): Promise<Run<Record<string, unknown> | undefined | null, DocumentOutput | undefined | null>> => {
  return getRuntime().execute(
    "airplane:mongodb_findOneAndUpdate",
    { collection, update, filter, projection, sort },
    { db: mongodbResourceID },
    opts
  );
};

export const findOneAndReplace = async (
  mongodbResourceID: string,
  collection: string,
  replacement: Record<string, unknown>,
  filter: Record<string, unknown> | undefined | null = null,
  projection: Record<string, unknown> | undefined | null = null,
  sort: Record<string, unknown> | undefined | null = null,
  upsert: boolean | undefined | null = null,
  opts?: ClientOptions
): Promise<Run<Record<string, unknown> | undefined | null, DocumentOutput | undefined | null>> => {
  return getRuntime().execute(
    "airplane:mongodb_findOneAndReplace",
    { collection, replacement, filter, projection, sort, upsert },
    { db: mongodbResourceID },
    opts
  );
};

export type InsertOneOutput = {
  InsertedID: string;
};

export const insertOne = async (
  mongodbResourceID: string,
  collection: string,
  document: Record<string, unknown>,
  opts?: ClientOptions
): Promise<Run<Record<string, unknown> | undefined | null, InsertOneOutput | undefined | null>> => {
  return getRuntime().execute(
    "airplane:mongodb_insertOne",
    { collection, document },
    { db: mongodbResourceID },
    opts
  );
};

export type InsertManyOutput = {
  InsertedIDs: string[];
};

export const insertMany = async (
  mongodbResourceID: string,
  collection: string,
  documents: Record<string, unknown>[],
  opts?: ClientOptions
): Promise<
  Run<Record<string, unknown> | undefined | null, InsertManyOutput | undefined | null>
> => {
  return getRuntime().execute(
    "airplane:mongodb_insertMany",
    { collection, documents },
    { db: mongodbResourceID },
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
  mongodbResourceID: string,
  collection: string,
  update: Record<string, unknown>,
  filter: Record<string, unknown> | undefined | null = null,
  upsert: boolean | undefined | null = null,
  opts?: ClientOptions
): Promise<Run<Record<string, unknown> | undefined | null, UpdateOutput | undefined | null>> => {
  return getRuntime().execute(
    "airplane:mongodb_updateOne",
    { collection, update, filter, upsert },
    { db: mongodbResourceID },
    opts
  );
};

export const updateMany = async (
  mongodbResourceID: string,
  collection: string,
  update: Record<string, unknown>,
  filter: Record<string, unknown> | undefined | null = null,
  upsert: boolean | undefined | null = null,
  opts?: ClientOptions
): Promise<Run<Record<string, unknown> | undefined | null, UpdateOutput | undefined | null>> => {
  return getRuntime().execute(
    "airplane:mongodb_updateMany",
    { collection, update, filter, upsert },
    { db: mongodbResourceID },
    opts
  );
};

export type DeleteOutput = {
  DeletedCount: number;
};

export const deleteOne = async (
  mongodbResourceID: string,
  collection: string,
  filter: Record<string, unknown>,
  opts?: ClientOptions
): Promise<Run<Record<string, unknown> | undefined | null, DeleteOutput | undefined | null>> => {
  return getRuntime().execute(
    "airplane:mongodb_deleteOne",
    { collection, filter },
    { db: mongodbResourceID },
    opts
  );
};

export const deleteMany = async (
  mongodbResourceID: string,
  collection: string,
  filter: Record<string, unknown>,
  opts?: ClientOptions
): Promise<Run<Record<string, unknown> | undefined | null, DeleteOutput | undefined | null>> => {
  return getRuntime().execute(
    "airplane:mongodb_deleteMany",
    { collection, filter },
    { db: mongodbResourceID },
    opts
  );
};

export const aggregate = async (
  mongodbResourceID: string,
  collection: string,
  pipeline: Record<string, unknown>[],
  opts?: ClientOptions
): Promise<
  Run<Record<string, unknown> | undefined | null, DocumentOutput[] | undefined | null>
> => {
  return getRuntime().execute(
    "airplane:mongodb_aggregate",
    { collection, pipeline },
    { db: mongodbResourceID },
    opts
  );
};

export type CountOutput = number;

export const countDocuments = async (
  mongodbResourceID: string,
  collection: string,
  filter: Record<string, unknown>,
  opts?: ClientOptions
): Promise<Run<Record<string, unknown> | undefined | null, CountOutput | undefined | null>> => {
  return getRuntime().execute(
    "airplane:mongodb_countDocuments",
    { collection, filter },
    { db: mongodbResourceID },
    opts
  );
};

export type DistinctOutput = unknown[];

export const distinct = async (
  mongodbResourceID: string,
  collection: string,
  field: string,
  filter: Record<string, unknown>,
  opts?: ClientOptions
): Promise<Run<Record<string, unknown> | undefined | null, DistinctOutput | undefined | null>> => {
  return getRuntime().execute(
    "airplane:mongodb_distinct",
    { collection, field, filter },
    { db: mongodbResourceID },
    opts
  );
};
