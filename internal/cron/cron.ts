// https://stackoverflow.com/questions/14203122/create-a-regular-expression-for-cron-statement

import type { CheckType } from "./dfa";

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

// <minute> <hour> <dayOfMonth> <month> <dayOfWeek>
// [0-59]   [0-23] [1-31]       [1-12]  [0-6]
// a        b      c            d       e
interface CronDFA {
  startState: "a";
  acceptStates: "end";
  transitions: {
    // minute: * OR 0-59
    a: Record<"*", "as"> &
      Record<"1" | "2" | "3" | "4" | "5", "a9s"> &
      Record<"0" | "6" | "7" | "8" | "9", "as">;
    a9s: Record<Digit, "as"> & Record<" ", "b">;
    as: Record<" ", "b">;
    // hour: * OR 0-23
    b: Record<"*", "bs"> &
      Record<"1", "b9s"> &
      Record<"2", "b3s"> &
      Record<"0" | "6" | "7" | "8" | "9", "bs">;
    b9s: Record<Digit, "bs"> & Record<" ", "c">;
    b3s: Record<"0" | "1" | "2" | "3", "bs"> & Record<" ", "c">;
    bs: Record<" ", "c">;
    // dayOfMonth: * OR 1-31
    c: Record<"*", "cs"> &
      Record<"1" | "2", "c9s"> &
      Record<"3", "c1s"> &
      Record<"4" | "5" | "6" | "7" | "8" | "9", "cs">;
    c9s: Record<Digit, "cs"> & Record<" ", "d">;
    c1s: Record<"0" | "1", "cs"> & Record<" ", "d">;
    cs: Record<" ", "d">;
    // month: * OR 1-12
    d: Record<"*", "ds"> &
      Record<"1", "d2s"> &
      Record<"2" | "3" | "4" | "5" | "6" | "7" | "8" | "9", "ds">;
    d2s: Record<"0" | "1" | "2", "ds"> & Record<" ", "e">;
    ds: Record<" ", "e">;
    // dayOfWeek: * OR 0-6
    e: Record<"*", "end"> & Record<"0" | "1" | "2" | "3" | "4" | "5" | "6", "end">;
  };
}

/**
 * Cron is a TypeScript type that validates a string against the Airplane CRON syntax.
 *
 * To learn more about Airplane's Cron syntax, see the Cron syntax documentation:
 * https://docs.airplane.dev/schedules/schedules#cron-syntax
 */
export type Cron<TStr extends string> = CheckType<
  CronDFA,
  TStr,
  "Invalid CRON string: https://docs.airplane.dev/schedules/schedules#cron-syntax"
>;
