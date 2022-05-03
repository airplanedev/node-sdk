import { Context, Info } from "@temporalio/activity";
import { ActivityExecuteInput, ActivityInboundCallsInterceptor, Next } from "@temporalio/worker";

export class ActivityLogInboundInterceptor implements ActivityInboundCallsInterceptor {
  info;
  constructor(ctx: Context) {
    this.info = ctx.info;
  }

  async execute(
    input: ActivityExecuteInput,
    next: Next<ActivityInboundCallsInterceptor, "execute">
  ) {
    log(this.info, `Starting activity with input: ${JSON.stringify(input)}`);
    try {
      const result = await next(input);
      log(this.info, `Result from activity run: ${JSON.stringify(input)}`);
      return result;
    } catch (error) {
      log(this.info, `Caught error, retrying: ${error}`);
      throw error;
    }
  }
}

const log = (info: Info, message?: any, ...optionalParams: any[]) => {
  console.log(
    `[ap:activity:${info.activityType}:${info.workflowExecution.workflowId}:${info.workflowExecution.runId}] ${message}`
  );
};
