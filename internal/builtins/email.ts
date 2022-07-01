import { ClientOptions } from "../api/client";
import { Run } from "../api/types";
import { getRuntime } from "../runtime";
import { convertResourceAliasToID } from "./builtins";

export type Contact = {
  email: string;
  name: string;
};

export type MessageOutput = Record<string, number>;

export const message = async (
  emailResource: string,
  sender: Contact,
  recipients: Contact[] | string[],
  subject = "",
  message = "",
  opts?: ClientOptions
): Promise<Run<Record<string, unknown> | undefined | null, MessageOutput>> => {
  return getRuntime().execute(
    "airplane:email_message",
    { sender, recipients, subject, message },
    { email: convertResourceAliasToID(emailResource) },
    opts
  );
};
