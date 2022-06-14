import { Run, ExecuteOptions, executeInternal } from "./tasks";

export type Contact = {
  email: string;
  name: string;
};

export default {
  message: async <Output = unknown>(
    emailResourceID: string,
    sender: Contact,
    recipients: Contact[] | string[] | string,
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
