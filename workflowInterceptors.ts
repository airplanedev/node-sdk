import {
  ActivityInput,
  Next,
  SignalInput,
  TimerInput,
  WorkflowExecuteInput,
  WorkflowInboundCallsInterceptor,
  workflowInfo,
  WorkflowInfo,
  WorkflowInterceptorsFactory,
  WorkflowOutboundCallsInterceptor,
} from "@temporalio/workflow";

export class WorkflowLogOutboundInterceptor implements WorkflowOutboundCallsInterceptor {
  info;
  constructor(info: WorkflowInfo) {
    this.info = info;
  }

  async scheduleActivity(
    input: ActivityInput,
    next: Next<WorkflowOutboundCallsInterceptor, "scheduleActivity">
  ): Promise<unknown> {
    const activityType = input.activityType;

    log(this.info, `Scheduling activity ${activityType}: ${JSON.stringify(input)}`);
    try {
      const result = await next(input);
      log(this.info, `Scheduling activity ${activityType} result: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      log(this.info, `Error scheduling activity ${activityType}: ${error}`);
      throw error;
    }
  }

  async startTimer(
    input: TimerInput,
    next: Next<WorkflowOutboundCallsInterceptor, "startTimer">
  ): Promise<void> {
    log(this.info, `Starting timer: ${JSON.stringify(input)}`);

    try {
      const result = await next(input);
      log(this.info, `Starting timer result: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      log(this.info, `Error starting timer: ${error}`);
      throw error;
    }
  }
}

class WorkflowLogInboundInterceptor implements WorkflowInboundCallsInterceptor {
  info;
  constructor(info: WorkflowInfo) {
    this.info = info;
  }

  async execute(
    input: WorkflowExecuteInput,
    next: Next<WorkflowInboundCallsInterceptor, "execute">
  ): Promise<unknown> {
    log(this.info, `Workflow inbound activity execution: ${JSON.stringify(input)}`);
    try {
      const result = await next(input);
      log(this.info, `Workflow inbound activity execution result: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      log(this.info, `Error in workflow activity execution: ${error}`);
      throw error;
    }
  }

  async handleSignal(
    input: SignalInput,
    next: Next<WorkflowInboundCallsInterceptor, "handleSignal">
  ): Promise<void> {
    log(this.info, `Handling signal: ${JSON.stringify(input)}`);
    try {
      const result = await next(input);
      log(this.info, `Handling signal result: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      log(this.info, `Error handling signal: ${error}`);
      throw error;
    }
  }
}

export const interceptors: WorkflowInterceptorsFactory = () => ({
  outbound: [new WorkflowLogOutboundInterceptor(workflowInfo())],
  inbound: [new WorkflowLogInboundInterceptor(workflowInfo())],
});

const log = (info: WorkflowInfo, message?: any, ...optionalParams: any[]) => {
  console.log(`[ap:interceptor::${info.workflowId}:${info.runId}] ${message}`);
};
