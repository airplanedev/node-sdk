import { ClientOptions } from "../api/client";
import { ParamValues, Run } from "../api/types";
import { getRuntime } from "../runtime";
import { convertResourceAliasToID } from "./builtins";

export enum Method {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Patch = "PATCH",
  Delete = "DELETE",
}

export enum BodyType {
  Json = "json",
  Raw = "raw",
  FormData = "form-data",
  FormURLEncoded = "x-www-form-urlencoded",
}

export type RequestOutput = {
  response: Record<string, unknown> | string;
};

export type RequestOptions = {
  headers?: Record<string, unknown> | null;
  urlParams?: Record<string, unknown> | null;
  bodyType?: BodyType | null;
  body?: Record<string, unknown> | string | null;
  formData?: Record<string, unknown> | null;
  client?: ClientOptions;
};

export const request = async (
  restResource: string,
  method: Method,
  path: string,
  opts: RequestOptions = {}
): Promise<Run<ParamValues, RequestOutput | undefined | null>> => {
  const { headers, urlParams, bodyType, body, formData, client } = opts;
  return getRuntime().execute(
    "airplane:rest_request",
    { method, path, headers: headers ?? {}, urlParams: urlParams ?? {}, bodyType, body, formData },
    { rest: convertResourceAliasToID(restResource) },
    client
  );
};
