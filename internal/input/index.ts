import { ClientOptions } from "../api/client";
import { ParamSchema } from "../api/types";
import { getRuntime } from "../runtime";
import { makeSlug } from "./slug";

export type InputOptions<Type> = {
  slug?: string;
  description?: string;
  required?: boolean;
  default?: Type;
  regex?: RegExp;
  options?: Array<Type | { label: string; value: Type }>;
  client?: ClientOptions;
};

export const text = async (name: string, opts: InputOptions<string> = {}): Promise<string> => {
  const param: ParamSchema<"string"> = {
    slug: opts.slug || makeSlug(name),
    name,
    type: "string",
    constraints: {
      optional: opts.required === false ? true : false,
      options: opts.options,
      regex: opts.regex?.source,
    },
    desc: opts.description,
    default: opts.default,
  };

  const values = await getRuntime().prompt([param], opts.client);
  return values[param.slug] as string;
};
