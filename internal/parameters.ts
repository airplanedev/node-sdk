// Attributes for different types of params
export type ParamBase<T> = {
  type: string;
  name?: string;
  description?: string;
  required?: boolean;
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

// JS Types for param types
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
  type: "shorttext";
};

export type LongTextParam = RegexableParam<JSParamTypes["longtext"]> & {
  type: "longtext";
};

export type SQLParam = RegexableParam<JSParamTypes["sql"]> & {
  type: "sql";
};

export type BooleanParam = ParamBase<JSParamTypes["boolean"]> & {
  type: "boolean";
};

export type FileParam = ParamBase<JSParamTypes["file"]> & {
  type: "file";
};

export type IntegerParam = SelectableParam<JSParamTypes["integer"]> & {
  type: "integer";
};

export type FloatParam = SelectableParam<JSParamTypes["float"]> & {
  type: "float";
};

export type DateParam = SelectableParam<JSParamTypes["date"]> & {
  type: "date";
};

export type DatetimeParam = SelectableParam<JSParamTypes["datetime"]> & {
  type: "datetime";
};

export type ConfigVarParam = SelectableParam<JSParamTypes["configvar"]> & {
  type: "configvar";
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

export type ParamTypes = Param["type"];
