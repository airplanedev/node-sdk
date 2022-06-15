import { Run, ExecuteOptions, executeInternal } from "./tasks";

export type Contact = {
  email: string;
  name: string;
};

export type EmailMessageOutput = Record<string, number>;

export default {
  message: async <Output = EmailMessageOutput | undefined | null>(
    emailResourceID: string,
    sender: Contact,
    recipients: Contact[] | string[],
    subject = "",
    message = "",
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:email_message",
      { sender, recipients, subject, message },
      { email: emailResourceID },
      opts
    );
  },
};
