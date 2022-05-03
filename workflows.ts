import { ActivityInterface, ActivityOptions } from "@temporalio/internal-workflow-common";
import {
  proxyActivities as temporalProxyActivities,
  sleep as temporalSleep,
} from "@temporalio/workflow";

export const sleep = (ms: string | number): Promise<void> => {
  return temporalSleep(ms);
};

export const proxyActivities = <A extends ActivityInterface>(options: ActivityOptions): A => {
  return temporalProxyActivities(options);
};
