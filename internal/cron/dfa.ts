// Inspired by: https://github.com/microsoft/TypeScript/issues/6579#issuecomment-710776922
// Specifically, this floating-point parser: https://www.typescriptlang.org/play?ts=4.1.0-dev.20201015#code/C4TwDgpgBAEhCGATAPAZWAJwCpQgD2AgDtEBnKUzASyIHMA+KAXinW1wOLKgAMASAN40AZhAywEiLAF9BlDDVrSeUAPwSkOAFxQiEAG5iA3ACgToSFCzwqAGzSYc+QiXLzFjFmyedXvOdR0skJEouLWdjIq6hG22roGxmY0hBjC8ADG0AAi6VACJlBFFMDwGMDo8IRQOu50ADSFxZlZYBWlhOS1gbSNxVCY8ESkVMBUAPbDNVAAShAZ4xgodb2z84vLPfUlCnT09I3SZhbQAIIZrcCkAJIAtmD2TUW58D4u3C99xZWEb1xuWyeUGuRDAAFdgH8-CsTJ4gSDwZCOO9yAAiVFqIEACh+EChH3SWAA2qiWhA2rjSKiALpqAYYMHQHTpWykCAAShqQPOlxu90e-X6LywX0FUGFJMGw1GE2GNKJuKw1KJcCQyAREKw9GposFsXVoM19CB9FM5nAZwu5KuyGFyP+4vS2w1SOcDpWnigPOtfIetsJ2wlqMoZXaVQgNOdhshpuOFq9Vravts2QgACMwbRkEC7W6-J8gYr7dDAf0XfiAbtaLDmPDoxWoOjMf0cR08cWCa8SWSKW2qbT1JhGdMWWzOVogUSgULCZKMEMRmNJv2FW2lSrJAbEVqddPivry8b+tSzSdxVRaKNmI2AAyogA+qIAjA-UQAmV8AZlfABZXwBWV8ADZXwAdlfAAOV8AE5UWSIhUnSLIoAAMVscYqkUAAFcYUnyIEQ3KXFplRO9dR7MNOhIlIIFoMRsgvUYqUfYR5wyJciHgFNGKuV98DASZiGABjL143UpUXWUunwsUilI1EdD3MUADI1gWJZkFRABqV8AFpUW2VFEHGYAAHkMBBQg6IwESmNRI9ZP6VS5nUlBbOAQyaOs9yqQcxyimc9YNNRAA6AzG1YzIOK4nzKnKeylMFQLXOQFZDPSOx7N1fojJM8zLNo+ieKpCd-OKZKNltHjPIQwqbOKhKyoCtTKtC8LUUi9jZRi4q4uARqmoqjS0oimxbCyxLUS8orRJKxKnJajT3JqqyZrsvz-KGlA2vStjou42a+oGsqts0iNHwAUXa-jBIQ1ALyIcyLrwAS9AQnzjs2xbNirdKxomxyOr27qDqYo7SsG76qtE3aopBj6Nsc06Ro6-6Dkmzr9o+iGTqh5aIuByYetmz6kah1FztRK7DJut6Kgep6Xtu4SGsR2Tka2UbMvRwHaaE+7aEejBnteoTsfm8ryZ0x99Jppm6di0p4rZlS8eqxs+fe1mJealzKpRjLxp52SKflsXeqV-qca+vWlvV03Ra1kmVaSqGDbR7Ligd5nxaaqBTvx72Fe1v2Od+rmjc9sUMf+nRbZ+xQ-u53UjiOEwAHp06HCBzUsEEABkhloMF4DogB9G9r29JNkDQjCxjoHCUkMu9jTPAui5L8unyrxMbTrzDG9whDDK01vc+gDu6C7iAy7fXveVr9DB9oJuR8bMeQpfNv4yn4vS9nz8F59Jf6+w4ePI3m8t4gN9vx3vOiEL6eD7Ln9j5rgeG9Xi-R+vp8IC6TvglduT9O6v3-B-fuy9v5r0vqRCA49QHP33uXICUDSCnxXnAwyIUkG7zAS-cuoEMFYNgb-RseCLq6X-CBY0Gd06jhzmeAAciZPeM8K6kK-ufZuG8QHxjYcADhr8e4sGrtAs+Q8+EUx-IBB+0AhEiPLvPcRfdME8OkevVEpwABCABhARlglGENQYfbhMDeHaOvhAORRjFHsNMZw9+ajF6aJ-jIm8iDEEJSAA

type Head<TStr extends string> = TStr extends `${infer THead}${string}` ? THead : never;

type Tail<TStr extends string> = TStr extends `${string}${infer TTail}` ? TTail : never;

export interface DFA {
  startState: string;
  acceptStates: string;
  errorStates: Record<string, string>;
  transitions: Record<string, Record<string, string>>;
}

type AcceptsImpl<
  TDFA extends DFA,
  TState extends string,
  TInput extends string
> = TState extends keyof TDFA["errorStates"]
  ? TDFA["errorStates"][TState]
  : TInput extends ""
  ? TState extends TDFA["acceptStates"]
    ? true
    : false
  : AcceptsImpl<TDFA, TDFA["transitions"][TState][Head<TInput>], Tail<TInput>>;

export type AcceptsImplDebug<
  TDFA extends DFA,
  TState extends string,
  TInput extends string
> = TState extends TDFA["errorStates"]
  ? TDFA["errorStates"][TState]
  : TInput extends ""
  ? TState extends TDFA["acceptStates"]
    ? true
    : false
  : [TDFA["transitions"][TState][Head<TInput>], Tail<TInput>];

export type Accepts<TDFA extends DFA, TInput extends string> = AcceptsImpl<
  TDFA,
  TDFA["startState"],
  TInput
>;

export type CheckType<
  TDFA extends DFA,
  TStr extends string,
  TErr extends string,
  _TResponse = Accepts<TDFA, TStr>
> = _TResponse extends true ? TStr : _TResponse extends string ? _TResponse : TErr;
