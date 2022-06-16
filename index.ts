export { _registerActivities } from "./activities";
import email from "./email";
import mongodb from "./mongodb";
import { appendOutput, setOutput } from "./output";
import rest from "./rest";
import slack from "./slack";
import sql from "./sql";
import { execute } from "./tasks";
export { ExecuteOptions } from "./api";

export { appendOutput, setOutput, execute, email, mongodb, rest, slack, sql };

export default {
  appendOutput,
  setOutput,
  execute,
  email,
  mongodb,
  rest,
  slack,
  sql,
};
