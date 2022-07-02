import { ClientOptions } from "../api/client";
import { ParamJSTypes, ParamLabeledOption, ParamSchema, ParamType, ParamValue } from "../api/types";
import { makeSlug } from "./slug";

type ExtendedParamValue = ParamValue | Date;

export type InputOptions<T extends ExtendedParamValue> = {
  slug?: string;
  description?: string;
  required?: boolean;
  default?: T;
  regex?: RegExp;
  options?: Array<T | ParamLabeledOption<T>>;
  client?: ClientOptions;
};

const isLabeledOption = <T extends ExtendedParamValue>(
  v: T | ParamLabeledOption<T>
): v is ParamLabeledOption<T> => {
  return typeof v === "object" && Object.prototype.hasOwnProperty.call(v, "value");
};

// mapOnInputOptions calls `fn` on every value type in InputOptions. Useful for converting
// values, e.g. `Date | string` -> `string`.
export const mapOnInputOptions = <I extends ExtendedParamValue, O extends ExtendedParamValue>(
  opts: InputOptions<I>,
  fn: (i: I) => O
): InputOptions<O> => {
  const fnMaybeUndefined = (i: I | undefined): O | undefined => {
    return i === undefined ? undefined : fn(i);
  };

  return {
    ...opts,
    default: fnMaybeUndefined(opts.default),
    options: opts.options?.map((o) => {
      if (isLabeledOption(o)) {
        return {
          ...o,
          value: fn(o.value),
        };
      } else {
        return fn(o);
      }
    }),
  };
};

export const optionsToSchema = <T extends ParamType>(
  name: string,
  type: T,
  opts: InputOptions<ParamJSTypes[T]>
): ParamSchema<T> => {
  return {
    slug: opts.slug || makeSlug(name),
    name,
    type,
    constraints: {
      optional: opts.required === false ? true : false,
      options: opts.options,
      regex: opts.regex?.source,
    },
    desc: opts.description,
    default: opts.default,
  };
};
