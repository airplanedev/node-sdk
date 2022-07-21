// Attributes for different types of params
export type ParamBase<T> = {
  kind: string;
  name?: string;
  description?: string;
  optional?: boolean;
  default?: T;
};

export type SelectOption<T> = {
  label: string;
  value: T;
};

export type SelectableParam<T> = ParamBase<T> & {
  options?: (T | SelectOption<T>)[];
};

export type RegexableParam<T> = SelectableParam<T> & {
  regex?: string;
};

// Airplane types
export type ConfigVar = {
  __airplaneType: "configvar";
  name: string;
  value: string;
};

export type File = {
  __airplaneType: "upload";
  id: string;
  url: string;
};

// JS Types for Kinds
export type JSParamTypes = {
  shorttext: string;
  longtext: string;
  sql: string;
  boolean: boolean;
  file: string;
  integer: number;
  float: number;
  date: string;
  datetime: string;
  configvar: string;
};

export type JSParamValues = {
  shorttext: string;
  longtext: string;
  sql: string;
  boolean: boolean;
  file: File;
  integer: number;
  float: number;
  date: string;
  datetime: string;
  configvar: ConfigVar;
};

// Airplane param types
export type ShortTextParam = RegexableParam<JSParamTypes["shorttext"]> & {
  kind: "shorttext";
};

export type LongTextParam = RegexableParam<JSParamTypes["longtext"]> & {
  kind: "longtext";
};

export type SQLParam = RegexableParam<JSParamTypes["sql"]> & {
  kind: "sql";
};

export type BooleanParam = ParamBase<JSParamTypes["boolean"]> & {
  kind: "boolean";
};

export type FileParam = ParamBase<JSParamTypes["file"]> & {
  kind: "file";
};

export type IntegerParam = SelectableParam<JSParamTypes["integer"]> & {
  kind: "integer";
};

export type FloatParam = SelectableParam<JSParamTypes["float"]> & {
  kind: "float";
};

export type DateParam = SelectableParam<JSParamTypes["date"]> & {
  kind: "date";
};

export type DatetimeParam = SelectableParam<JSParamTypes["datetime"]> & {
  kind: "datetime";
};

export type ConfigVarParam = SelectableParam<JSParamTypes["configvar"]> & {
  kind: "configvar";
};

// Used by task templating
export type Param =
  | ShortTextParam
  | LongTextParam
  | SQLParam
  | BooleanParam
  | FileParam
  | IntegerParam
  | FloatParam
  | DateParam
  | DatetimeParam
  | ConfigVarParam;

export type ParamKinds = Param["kind"];
