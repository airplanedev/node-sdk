import fetch from 'node-fetch'
import { Poller } from './poll'
import { version } from './package.json'

export enum RunStatus {
  NotStarted = 'NotStarted',
  Queued = 'Queued',
  Active = 'Active',
  Succeeded = 'Succeeded',
  Failed = 'Failed',
  Cancelled = 'Cancelled',
}

const terminalStatuses = [RunStatus.Succeeded, RunStatus.Failed, RunStatus.Cancelled]

export type Run<Input = unknown, Output = unknown> = {
  id: string
  taskID: string
  paramValues: Input
  status: RunStatus
  output: Output
}

// TODO: override for single type
export async function execute<Input = unknown, Output = unknown>(slug: string, params?: Record<string, any> | undefined | null): Promise<Run<Input, Output>> {
  const apiHost = process.env.AIRPLANE_API_HOST
  if (!apiHost) {
    throw new Error("expected an api host")
  }

  // https://github.com/airplanedev/airport/pull/2027
  const token = process.env.AIRPLANE_TOKEN ?? process.env.AIRPLANE_RUN_AUTHN_TOKEN
  if (!token) {
    throw new Error("expected an authentication token")
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-Airplane-Token': token,
    'X-Airplane-Client-Kind': "sdk/node",
    'X-Airplane-Client-Version': version,
  }

  // TODO: handle API errors
  // TODO: convert status codes to nice error messages
  // TODO: configure retries
  const response = await fetch(`${apiHost}/v0/tasks/execute`, {
    method: "post",
    body: JSON.stringify({
      slug,
      paramValues: params ?? {},
    }),
    headers,
  })
  const { runID } = await response.json() as {
    runID: string
  }

  // Poll until the run is ready:
  const poller = new Poller({ delayMs: 500 })
  return poller.run(async () => {
    let response = await fetch(`${apiHost}/v0/runs/get?id=${runID}`, {
      method: "get",
      headers,
    })
    const run = await response.json() as {
      id: string
      status: RunStatus
      paramValues: Input
      taskID: string
    }

    if (!terminalStatuses.includes(run.status)) {
      return null
    }

    response = await fetch(`${apiHost}/v0/runs/getOutputs?id=${runID}`, {
      method: "get",
      headers,
    })
    const { output } = await response.json() as { output: Output }

    return {
      id: run.id,
      taskID: run.taskID,
      paramValues: run.paramValues,
      status: run.status,
      output,
    }
  })
}
