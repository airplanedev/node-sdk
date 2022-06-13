import { Run, ExecuteOptions, executeInternal } from "./tasks";

export enum Method {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Patch = "PATCH",
  Delete = "DELETE",
}

export enum BodyType {
  Unknown = "",
  Json = "json",
  Raw = "raw",
  FormData = "form-data",
  FormURLEncoded = "x-www-form-urlencoded",
}

export default {
  Method,
  BodyType,

  request: async <Output = unknown>(
    rest_resource_id: string,
    method: Method,
    path: string,
    headers: Record<string, unknown> = {},
    urlParams: Record<string, unknown> = {},
    bodyType: BodyType = BodyType.Unknown,
    body: unknown = null,
    formData: Record<string, unknown> | undefined | null = null,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:rest_request",
      { method, path, headers, urlParams, bodyType, body, formData },
      { rest: rest_resource_id },
      opts
    );
  },
};
