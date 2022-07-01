export enum RunStatus {
  NotStarted = "NotStarted",
  Queued = "Queued",
  Active = "Active",
  Succeeded = "Succeeded",
  Failed = "Failed",
  Cancelled = "Cancelled",
}

export type Run<P extends ParamValues = ParamValues, O = unknown> = {
  id: string;
  taskID: string;
  paramValues: P;
  status: RunStatus;
  output: O;
};

export const isStatusTerminal = (status: RunStatus): boolean => {
  switch (status) {
    case RunStatus.Succeeded:
    case RunStatus.Failed:
    case RunStatus.Cancelled:
      return true;
    default:
      return false;
  }
};

export type ParamSchema<T extends ParamType = ParamType> = {
  slug: string;
  name: string;
  desc?: string;
  type: T;
  component?: string;
  default?: ParamJSTypes[T];
  constraints: ParamConstraints<T>;
};

export type ParamConstraints<T extends ParamType = ParamType> = {
  optional?: boolean;
  regex?: string;
  options?: Array<ParamJSTypes[T] | ParamLabeledOption<ParamJSTypes[T]>>;
};

export type ParamLabeledOption<T> = {
  label?: string;
  value: T;
};

export type ParamJSTypes = {
  string: string;
  boolean: boolean;
  upload: string;
  integer: number;
  float: number;
  date: string;
  datetime: string;
  configvar: string;
};

export type ParamType = keyof ParamJSTypes;

export type ParamValue =
  | undefined
  | null
  | Record<string, unknown> /* internal map|object type */
  | unknown[] /* internal list type */
  | (ParamJSTypes extends { [type: string]: infer I } ? I : never);

export type ParamValues = {
  [slug: string]: ParamValue;
};

export type Prompt = {
  id: string;
  schema: ParamSchema[];
  values: ParamValues;
  submittedAt: string | null;
};
