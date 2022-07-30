// https://stackoverflow.com/questions/14203122/create-a-regular-expression-for-cron-statement

import type { CheckType } from "./dfa";

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

// <minute> <hour> <dayOfMonth> <month> <dayOfWeek>
// a        b      c            d       e
interface CronDFA {
  startState: "a";
  acceptStates: "end";
  errorStates: {
    invalidMinute: `invalid minute: expected '*' OR [0-59]`;
    invalidHour: `invalid hour: expected '*' OR [0-23]`;
    invalidDayOfMonth: `invalid day of month: expected '*' OR [1-31]`;
    invalidMonth: `invalid month: expected '*' OR [1-12]`;
    invalidDayOfWeek: `invalid day of week: expected '*' OR [0-6]`;
  };
  transitions: {
    // minute
    a: Record<"*", "as"> &
      Record<"1" | "2" | "3" | "4" | "5", "a9s"> &
      Record<"0" | "6" | "7" | "8" | "9", "as"> &
      Record<string, "invalidMinute">;
    a9s: Record<Digit, "as"> & Record<" ", "b"> & Record<string, "invalidMinute">;
    as: Record<" ", "b"> & Record<string, "invalidMinute">;
    // hour
    b: Record<"*", "bs"> &
      Record<"1", "b9s"> &
      Record<"2", "b3s"> &
      Record<"0" | "6" | "7" | "8" | "9", "bs"> &
      Record<string, "invalidHour">;
    b9s: Record<Digit, "bs"> & Record<" ", "c"> & Record<string, "invalidHour">;
    b3s: Record<"0" | "1" | "2" | "3", "bs"> & Record<" ", "c"> & Record<string, "invalidHour">;
    bs: Record<" ", "c"> & Record<string, "invalidHour">;
    // dayOfMonth
    c: Record<"*", "cs"> &
      Record<"1" | "2", "c9s"> &
      Record<"3", "c1s"> &
      Record<"4" | "5" | "6" | "7" | "8" | "9", "cs"> &
      Record<string, "invalidDayOfMonth">;
    c9s: Record<Digit, "cs"> & Record<" ", "d"> & Record<string, "invalidDayOfMonth">;
    c1s: Record<"0" | "1", "cs"> & Record<" ", "d"> & Record<string, "invalidDayOfMonth">;
    cs: Record<" ", "d"> & Record<string, "invalidDayOfMonth">;
    // month
    d: Record<"*", "ds"> &
      Record<"1", "d2s"> &
      Record<"2" | "3" | "4" | "5" | "6" | "7" | "8" | "9", "ds"> &
      Record<string, "invalidMonth">;
    d2s: Record<"0" | "1" | "2", "ds"> & Record<" ", "e"> & Record<string, "invalidMonth">;
    ds: Record<" ", "e"> & Record<string, "invalidMonth">;
    // dayOfWeek
    e: Record<"*", "end"> &
      Record<"0" | "1" | "2" | "3" | "4" | "5" | "6", "end"> &
      Record<string, "invalidDayOfWeek">;
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
