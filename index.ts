import * as email from "./internal/builtins/email";
import * as mongodb from "./internal/builtins/mongodb";
import * as rest from "./internal/builtins/rest";
import * as slack from "./internal/builtins/slack";
import * as sql from "./internal/builtins/sql";
import { execute } from "./internal/execute";
import * as input from "./internal/input";
import { appendOutput, setOutput } from "./internal/output";

// Export the core methods so they can be directly imported:
//
// import { execute } from 'airplane'
export { appendOutput, setOutput, execute };

// Default export the entire airplane SDK for convenience, e.g.:
//
// import airplane from 'airplane'
// airplane.execute(...)
// airplane.email.message(...)
export default {
  appendOutput,
  setOutput,
  execute,
  email,
  mongodb,
  rest,
  slack,
  sql,
  input,
};

// Exported types
export type { ClientOptions } from "./internal/api/client";
export type { RunStatus, Run } from "./internal/api/types";
