export { registerActivities } from "./activities";
import email from "./email";
import mongodb from "./mongodb";
import { appendOutput, setOutput } from "./output";
import rest from "./rest";
import slack from "./slack";
import sql from "./sql";
import { execute } from "./tasks";
export { ExecuteOptions } from "./tasks";

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
