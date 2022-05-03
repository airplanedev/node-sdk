import { Context } from "@temporalio/activity";

export const activityLog = (message?: any, ...optionalParams: any[]) => {
  const info = Context.current().info;
  console.log(
    `[ap:activity:${info.activityType}:${info.workflowExecution.workflowId}:${info.workflowExecution.runId}] ${message}`
  );
};
