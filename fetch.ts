import { version } from './package.json'
import fetch, {FetchError} from 'node-fetch'
import querystring from 'query-string'
import withFetchRetries, {RequestInitWithRetry} from 'fetch-retry'

export type FetchOptions = {
  host: string
  token: string
}

// Fetcher is a wrapper around node-fetch with reasonable defaults that understands the Airplane API format.
export class Fetcher {
  private opts: FetchOptions
  private fetch: ReturnType<typeof withFetchRetries>

  constructor(opts: FetchOptions) {
    if (!opts.host) {
      throw new Error("expected an api host")
    }
    if (!opts.token) {
      throw new Error("expected an authentication token")
    }

    this.opts = opts

    // https://github.com/jonbern/fetch-retry
    this.fetch = withFetchRetries(fetch as any, {
      retryOn: (attempt, error, response) => {
        // Retry up to 5 times:
        if (attempt > 5) {
          return false
        }

        // Retry Node.js system errors:
        // https://github.com/node-fetch/node-fetch/blob/main/docs/ERROR-HANDLING.md
        if (error != null && error.name === 'FetchError' && (error as FetchError).type === 'system') {
          return true
        }

        // Retry server errors:
        if (response && response.status >= 500 && response.status !== 501) {
          return true
        }

        return false
      },
      retryDelay: (attempt) => {
        return Math.max(Math.pow(1.3, attempt) * 100, 1000)
      }
    } as RequestInitWithRetry)
  }

  async get<Output = unknown>(path: string, params?: Record<string, unknown>): Promise<Output> {
    const url = new URL(this.opts.host)
    url.pathname = path
    url.search = params ? querystring.stringify(params) : ''

    const response = await this.fetch(url.toString(), {
      method: "get",
      headers: {
        'X-Airplane-Token': this.opts.token,
        'X-Airplane-Client-Kind': "sdk/node",
        'X-Airplane-Client-Version': version,
      },
    })

    return await response.json() as Output
  }

  async post<Output = unknown>(path: string, body?: Record<string, unknown>): Promise<Output> {
    const url = new URL(this.opts.host)
    url.pathname = path

    const response = await this.fetch(url.toString(), {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        'Content-Type': "application/json",
        'X-Airplane-Token': this.opts.token,
        'X-Airplane-Client-Kind': "sdk/node",
        'X-Airplane-Client-Version': version,
      },
    })

    return await response.json() as Output
  }
}
