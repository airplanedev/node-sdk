import { getRuntime } from "../runtime";
import { mapOnInputOptions, InputOptions, optionsToSchema } from "./options";

export type { InputOptions };

export const text = async (name: string, opts: InputOptions<string> = {}): Promise<string> => {
  const param = optionsToSchema(name, "string", opts);
  const values = await getRuntime().prompt([param], opts.client);
  return values[param.slug] as string;
};

export const text2 = async (name: string, opts: InputOptions<string> = {}): Promise<string> => {
  const param = optionsToSchema(name, "string", opts);
  const values = await getRuntime().prompt([param], opts.client);
  return values[param.slug] as string;
};

export const longText = async (name: string, opts: InputOptions<string> = {}): Promise<string> => {
  const param = optionsToSchema(name, "string", opts);
  param.component = "textarea";
  const values = await getRuntime().prompt([param], opts.client);
  return values[param.slug] as string;
};

export const sql = async (name: string, opts: InputOptions<string> = {}): Promise<string> => {
  const param = optionsToSchema(name, "string", opts);
  param.component = "editor-sql";
  const values = await getRuntime().prompt([param], opts.client);
  return values[param.slug] as string;
};

export const number = async (name: string, opts: InputOptions<number> = {}): Promise<number> => {
  const param = optionsToSchema(name, "float", opts);
  const values = await getRuntime().prompt([param], opts.client);
  return values[param.slug] as number;
};

export const integer = async (name: string, opts: InputOptions<number> = {}): Promise<number> => {
  const param = optionsToSchema(name, "integer", opts);
  const values = await getRuntime().prompt([param], opts.client);
  return values[param.slug] as number;
};

export const boolean = async (name: string, opts: InputOptions<boolean> = {}): Promise<boolean> => {
  const param = optionsToSchema(name, "boolean", opts);
  const values = await getRuntime().prompt([param], opts.client);
  return values[param.slug] as boolean;
};

export const date = async (name: string, opts: InputOptions<string | Date> = {}): Promise<Date> => {
  // Under the hood, dates are represented as "YYYY-MM-DD" strings. For ease-of-use,
  // we also support Date objects. Align on strings here.
  const newOpts = mapOnInputOptions(opts, (v: Date | string): string => {
    if (typeof v === "string") {
      return v;
    }
    if (v instanceof Date) {
      const month = v.getMonth().toString().padStart(2, "0");
      const day = v.getDate().toString().padStart(2, "0");
      return `${v.getFullYear()}-${month}-${day}`;
    }

    throw new Error("Expected a Date or string");
  });

  const param = optionsToSchema(name, "date", newOpts);
  const values = await getRuntime().prompt([param], newOpts.client);
  const d = values[param.slug] as string;

  // Convert back to Dates before passing back.
  return new Date(d);
};

export const datetime = async (
  name: string,
  opts: InputOptions<string | Date> = {}
): Promise<Date> => {
  // Under the hood, datetimes are represented as UTC ISO8601 strings. For ease-of-use,
  // we also support Date objects. Align on strings here.
  const newOpts = mapOnInputOptions(opts, (v: Date | string): string => {
    if (typeof v === "string") {
      return v;
    }
    if (v instanceof Date) {
      return v.toISOString();
    }

    throw new Error("Expected a Date or string");
  });

  const param = optionsToSchema(name, "datetime", newOpts);
  const values = await getRuntime().prompt([param], newOpts.client);
  const d = values[param.slug] as string;

  // Convert back to Dates before passing back.
  return new Date(d);
};
