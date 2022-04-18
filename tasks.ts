import got from 'got/dist/source'
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

  const token = process.env.AIRPLANE_TOKEN
  if (!token) {
    throw new Error("expected an authentication token")
  }

  const headers = {
    'X-Airplane-Token': token,
    'X-Airplane-Client-Kind': "sdk/node",
    'X-Airplane-Client-Version': version,
  }

  // TODO: handle API errors
  // TODO: convert status codes to nice error messages
  // TODO: configure retries
  const { runID } = await got.post(`${apiHost}/v0/tasks/execute`, {
    json: {
      slug,
      paramValues: params ?? {},
    },
    headers,
  }).json<{
    runID: string
  }>()


  // Poll until the run is ready:
  const poller = new Poller({ delayMs: 500 })
  return poller.run(async () => {
    const run = await got.get(`${apiHost}/v0/runs/get`, {
      searchParams: {
        id: runID,
      },
      headers,
    }).json<{
      id: string
      status: RunStatus
      paramValues: Input
      taskID: string
    }>()
    
    if (!terminalStatuses.includes(run.status)) {
      return null
    }

    const { output } = await got.get(`${apiHost}/v0/runs/getOutputs`, {
      searchParams: {
        id: runID,
      },
      headers,
    }).json<{ output: Output }>()

    return {
      id: run.id,
      taskID: run.taskID,
      paramValues: run.paramValues,
      status: run.status,
      output,
    }
  })
}
