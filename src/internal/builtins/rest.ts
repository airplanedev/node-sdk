import { ClientOptions } from "../api/client";
import { Run } from "../api/types";
import { runtime } from "../runtime";

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

export const request = async (
  restResourceID: string,
  method: Method,
  path: string,
  headers: Record<string, unknown> = {},
  urlParams: Record<string, unknown> = {},
  bodyType: BodyType | undefined | null = null,
  body: Record<string, unknown> | string | undefined | null = null,
  formData: Record<string, unknown> | undefined | null = null,
  opts?: ClientOptions
): Promise<Run<Record<string, unknown> | undefined | null, RequestOutput | undefined | null>> => {
  return runtime.execute(
    "airplane:rest_request",
    { method, path, headers, urlParams, bodyType, body, formData },
    { rest: restResourceID },
    opts
  );
};
