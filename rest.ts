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

export type RESTRequestOutput = {
  response: Record<string, unknown> | string;
};

export default {
  Method,
  BodyType,

  request: async <Output = RESTRequestOutput | undefined | null>(
    restResourceID: string,
    method: Method,
    path: string,
    headers: Record<string, unknown> = {},
    urlParams: Record<string, unknown> = {},
    bodyType: BodyType = BodyType.Unknown,
    body: Record<string, unknown> | string | undefined | null = null,
    formData: Record<string, unknown> | undefined | null = null,
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:rest_request",
      { method, path, headers, urlParams, bodyType, body, formData },
      { rest: restResourceID },
      opts
    );
  },
};
