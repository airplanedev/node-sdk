import { ClientOptions } from "../api/client";
import { Run } from "../api/types";
import { runtime } from "../runtime";

export enum RESTMethod {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Patch = "PATCH",
  Delete = "DELETE",
}

export enum RESTBodyType {
  Json = "json",
  Raw = "raw",
  FormData = "form-data",
  FormURLEncoded = "x-www-form-urlencoded",
}

export type RESTRequestOutput = {
  response: Record<string, unknown> | string;
};

export const request = async (
  restResourceID: string,
  method: RESTMethod,
  path: string,
  headers: Record<string, unknown> = {},
  urlParams: Record<string, unknown> = {},
  bodyType: RESTBodyType | undefined | null = null,
  body: Record<string, unknown> | string | undefined | null = null,
  formData: Record<string, unknown> | undefined | null = null,
  opts?: ClientOptions
): Promise<
  Run<Record<string, unknown> | undefined | null, RESTRequestOutput | undefined | null>
> => {
  return runtime.execute(
    "airplane:rest_request",
    { method, path, headers, urlParams, bodyType, body, formData },
    { rest: restResourceID },
    opts
  );
};
