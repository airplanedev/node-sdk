import { execute } from "./execute";
import { Param, JSParamValues, ParamKinds } from "./parameters";
import { RuntimeKind } from "./runtime";

export type ParamKind<PSchema extends ParamKinds | Param> = PSchema extends Param
  ? PSchema["kind"]
  : PSchema;

export type Params = Record<string, ParamKinds | Param>;

export type ParamValues<TParams extends Params> = {
  [PSlug in keyof TParams]: JSParamValues[ParamKind<TParams[PSlug]>];
};

export type TaskConfig<TParams extends Params> = {
  slug: string;
  name: string;
  description?: string;
  parameters?: TParams;
  requireRequests?: boolean;
  allowSelfApprovals?: boolean;
  timeout?: number;
  constraints?: Record<string, string>;
  runtime?: "standard" | "workflow";
};

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export type UserFunc<TParams extends Params, TOutput> = (params: ParamValues<TParams>) => TOutput;

export type AirplaneFunc<TParams extends Params, TOutput> = (
  params: ParamValues<TParams>
) => Promise<Awaited<TOutput>>;

export const task = <TParams extends Params, TOutput>(
  config: TaskConfig<TParams>,
  f: UserFunc<TParams, TOutput>
): AirplaneFunc<TParams, TOutput> => {
  const runtime = process.env.AIRPLANE_RUNTIME ?? "";
  const inAirplaneRuntime = runtime === RuntimeKind.Standard || runtime === RuntimeKind.Workflow;

  const wrappedF = async (params: ParamValues<TParams>): Promise<Awaited<TOutput>> => {
    if (inAirplaneRuntime) {
      return (await execute(config.slug, params)).output as Awaited<TOutput>;
    }
    return f.apply(null, [params]) as Awaited<TOutput>;
  };
  wrappedF.__airplane = {
    config: config,
    baseFunc: f,
  };
  return wrappedF;
};
