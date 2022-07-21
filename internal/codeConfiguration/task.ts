import { execute } from "../execute";
import { ParamSchema, JSParamValues, ParamKinds, ParamSchemaKind } from "./paramTypes";

export type Params = Record<string, ParamKinds | ParamSchema>;

export type ParamValues<PSchema extends Params> = {
  [PSlug in keyof PSchema]: JSParamValues[ParamSchemaKind<PSchema[PSlug]>];
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

export type UserFunc<TParams extends Params> = (params: ParamValues<TParams>) => any;

export type AirplaneFunc<TParams extends Params> = (
  params: ParamValues<TParams>
) => Promise<Awaited<ReturnType<UserFunc<TParams>>>>;

export const Task = <TParams extends Params>(
  config: TaskConfig<TParams>,
  f: UserFunc<TParams>
): AirplaneFunc<TParams> => {
  const inAirplaneRuntime = !!(process.env.AIRPLANE_RUN_ID ?? "");

  const wrappedF = async (
    params: ParamValues<TParams>
  ): Promise<Awaited<ReturnType<UserFunc<TParams>>>> => {
    if (inAirplaneRuntime) {
      return (await execute(config.slug, params)).output;
    }
    return f.apply(null, [params]);
  };
  wrappedF._airplane = {
    config: config,
    baseFunc: f,
  };
  return wrappedF;
};
