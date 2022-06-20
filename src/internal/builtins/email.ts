import { ClientOptions } from "../api/client";
import { Run } from "../api/types";
import { runtime } from "../runtime";

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
): Promise<Run<Record<string, unknown> | undefined | null, MessageOutput>> => {
  return runtime.execute(
    "airplane:email_message",
    { sender, recipients, subject, message },
    { email: emailResourceID },
    opts
  );
};
