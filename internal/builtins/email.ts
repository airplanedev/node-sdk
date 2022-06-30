import { ClientOptions } from "../api/client";
import { ParamValues, Run } from "../api/types";
import { getRuntime } from "../runtime";

export type Contact = {
  email: string;
  name: string;
};

export type MessageOutput = Record<string, number>;

export const message = async (
  emailResourceID: string,
  sender: Contact,
  recipients: Contact[] | string[],
  subject = "",
  message = "",
  opts?: ClientOptions
): Promise<Run<ParamValues, MessageOutput>> => {
  return getRuntime().execute(
    "airplane:email_message",
    { sender, recipients, subject, message },
    { email: emailResourceID },
    opts
  );
};
