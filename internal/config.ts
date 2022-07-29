import { execute } from "./execute";
import { Param, JSParamValues, ParamTypes } from "./parameters";
import { RuntimeKind } from "./runtime";

export type ParamType<TSchema extends ParamTypes | Param> = TSchema extends Param
  ? TSchema["type"]
  : TSchema;

export type Params = Record<string, ParamTypes | Param>;

export type ParamValues<TParams extends Params> = {
  [TSlug in keyof TParams]: JSParamValues[ParamType<TParams[TSlug]>];
};

export type Schedule<TParams extends Params> = {
  cron: string;
  name?: string;
  description?: string;
  paramValues?: ParamValues<TParams>;
};

export type TaskConfig<TParams extends Params> = {
  slug: string;
  name?: string;
  description?: string;
  parameters?: TParams;
  requireRequests?: boolean;
  allowSelfApprovals?: boolean;
  timeout?: number;
  constraints?: Record<string, string>;
  runtime?: "standard" | "workflow";
  resources?: Record<string, string>;
  schedules?: Record<string, Schedule<TParams>>;
};

export type UserFunc<TParams extends Params, TOutput> = (params: ParamValues<TParams>) => TOutput;

export type AirplaneFunc<TParams extends Params, TOutput> = (
  params: ParamValues<TParams>
) => Promise<Awaited<TOutput>>;

export const task = <TParams extends Params, TOutput>(
  config: TaskConfig<TParams>,
  f: UserFunc<TParams, TOutput>
): AirplaneFunc<TParams, TOutput> => {
  const inAirplaneRuntime =
    process.env.AIRPLANE_RUNTIME !== undefined && process.env.AIRPLANE_RUNTIME !== RuntimeKind.Dev;

  const wrappedF = async (params: ParamValues<TParams>): Promise<Awaited<TOutput>> => {
    if (inAirplaneRuntime) {
      return (await execute<Awaited<TOutput>>(config.slug, params)).output;
    }
    return await f.apply(null, [params]);
  };
  wrappedF.__airplane = {
    config: config,
    baseFunc: f,
  };
  return wrappedF;
};
