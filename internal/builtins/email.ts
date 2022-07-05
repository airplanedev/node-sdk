import { ClientOptions } from "../api/client";
import { ParamValues, Run } from "../api/types";
import { getRuntime } from "../runtime";
import { convertResourceAliasToID } from "./builtins";

export type Contact = {
  email: string;
  name: string;
};

export type EmailOptions = {
  subject?: string;
  message?: string;
  client?: ClientOptions;
};

export type MessageOutput = Record<string, number>;

export const message = async (
  emailResource: string,
  sender: Contact,
  recipients: Contact[] | string[],
  opts: EmailOptions = {}
): Promise<Run<ParamValues, MessageOutput>> => {
  const { subject = "", message = "", client } = opts;
  return getRuntime().execute(
    "airplane:email_message",
    { sender, recipients, subject, message },
    { email: convertResourceAliasToID(emailResource) },
    client
  );
};
