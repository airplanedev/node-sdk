import https from 'https'
import { version } from './package.json'

export enum RunStatus {
  NotStarted = 'NotStarted',
  Queued = 'Queued',
  Active = 'Active',
  Succeeded = 'Succeeded',
  Failed = 'Failed',
  Cancelled = 'Cancelled',
}

export type User = {
  id: string
  email: string
  name: string
}

export type Run<Input = unknown, Output = unknown> = {
  id: string
  url: string
  status: RunStatus
  input: Input
  output: Output
  task: {
    id: string
    url: string
  }
  requestor?: User
  creator: User
}

// TODO: override for single type
export function execute<Input = unknown, Output = unknown>(slug: string, params: Record<string, any>): Promise<Run<Input, Output>> {
  const apiHost = process.env.AIRPLANE_API_HOST
  if (!apiHost) {
    throw new Error("expected an api host")
  }

  const token = process.env.AIRPLANE_RUN_AUTHN_TOKEN
  if (!token) {
    throw new Error("expected an authn token")
  }

  const data = JSON.stringify({
    slug,
  })

  const req = https.request({
    hostname: apiHost,
    port: 443,
    path: '/v0/tasks/execute',
    method: 'POST',
    headers: {
      'X-Airplane-Token': token,
      'X-Airplane-Client-Kind': "sdk/node",
      'X-Airplane-Client-Version': version,
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  })

  // TODO

  return {}
}
