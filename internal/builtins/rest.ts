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

export type InputOptions = {
  headers?: Record<string, unknown>;
  urlParams?: Record<string, unknown>;
  bodyType?: BodyType | undefined | null;
  body?: Record<string, unknown> | string | undefined | null;
  formData?: Record<string, unknown> | undefined | null;
  client?: ClientOptions
};

export const request = async (
  restResource: string,
  method: Method,
  path: string,
  opts: InputOptions = {},
): Promise<Run<ParamValues, RequestOutput | undefined | null>> => {
  const {
    headers = {},
    urlParams = {},
    bodyType,
    body,
    formData,
    client
  } = opts;
  return getRuntime().execute(
    "airplane:rest_request",
    { method, path, headers, urlParams, bodyType, body, formData },
    { rest: convertResourceAliasToID(restResource) },
    client
  );
};
