import { Run, ExecuteOptions, executeInternal } from "./tasks";

export class Sender {
  email = "";
  name = "";

  constructor(email: string, name: string) {
    this.email = email;
    this.name = name;
  }
}

export default {
  Sender,

  message: async <Output = unknown>(
    email_resource_id: string,
    sender: Sender,
    recipients: unknown,
    subject = "",
    message = "",
    opts?: ExecuteOptions
  ): Promise<Run<Record<string, unknown> | undefined | null, Output>> => {
    return executeInternal(
      "airplane:email_message",
      { sender, recipients, subject, message },
      { email: email_resource_id },
      opts
    );
  },
};
