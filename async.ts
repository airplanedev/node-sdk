import { AsyncLocalStorage } from "@temporalio/workflow";
export type AirplaneStore = {
  runtime?: string;
};

export const _storage = new AsyncLocalStorage<AirplaneStore>();
