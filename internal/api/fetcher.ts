import fetch from "cross-fetch";
import withFetchRetries, { RequestInitWithRetry } from "fetch-retry";
import type { FetchError } from "node-fetch";
import querystring from "query-string";

import pkg from "../../package.json";

export type FetcherOptions = {
  host: string;
  token?: string;
  apiKey?: string;
  envID?: string;
  envSlug?: string;
  source?: string;
  retryDelay?: (attempt: number) => number;
};

// Fetcher is a wrapper around node-fetch with reasonable defaults that understands the Airplane API format.
export class Fetcher {
  private host: string;
  private token?: string;
  private apiKey?: string;
  private envID?: string;
  private envSlug?: string;
  private source?: string;
  private fetch: ReturnType<typeof withFetchRetries>;
  private retryDelay: FetcherOptions["retryDelay"];

  constructor(opts: FetcherOptions) {
    if (!opts.host) {
      throw new Error("expected an api host");
    }
    this.host = opts.host;
    this.token = opts.token;
    this.apiKey = opts.apiKey;

    if (this.token && this.apiKey) {
      throw new Error("expected a single authentication method");
    }

    this.envID = opts.envID;
    this.envSlug = opts.envSlug;
    this.source = opts.source;

    const defaultRetryDelay: FetcherOptions["retryDelay"] = (attempt) => {
      return [0, 100, 200, 400, 600, 800, 1000][attempt] ?? 1000;
    };
    this.retryDelay = opts.retryDelay ?? defaultRetryDelay;

    // https://github.com/jonbern/fetch-retry
    this.fetch = withFetchRetries(
      fetch as any, // eslint-disable-line
      {
        retryOn: (attempt, error, response) => {
          // Retry up to 5 times:
          if (attempt > 5) {
            return false;
          }

          // Retry Node.js system errors:
          // https://github.com/node-fetch/node-fetch/blob/main/docs/ERROR-HANDLING.md
          if (
            error != null &&
            error.name === "FetchError" &&
            (error as FetchError).type === "system"
          ) {
            // Don't retry nock matching errors (indicates an invalid tests)
            if ((error as FetchError).errno === "ERR_NOCK_NO_MATCH") {
              return false;
            }

            return true;
          }

          // Retry server errors:
          if (response && response.status >= 500 && response.status !== 501) {
            return true;
          }

          return false;
        },
        retryDelay: this.retryDelay,
      } as RequestInitWithRetry
    );
  }

  async get<Output = unknown>(path: string, params?: Record<string, unknown>): Promise<Output> {
    const url = new URL(this.host);
    url.pathname = path;
    url.search = params ? querystring.stringify(params) : "";
    const headers: HeadersInit = {
      "X-Airplane-Client-Kind": "sdk/node",
      "X-Airplane-Client-Version": pkg.version,
    };
    if (this.token) {
      headers["X-Airplane-Token"] = this.token;
    }
    if (this.apiKey) {
      headers["X-Airplane-API-Key"] = this.apiKey;
    }
    if (this.envID) {
      headers["X-Airplane-Env-ID"] = this.envID;
    }
    if (this.envSlug) {
      headers["X-Airplane-Env-Slug"] = this.envSlug;
    }
    if (this.source) {
      headers["X-Airplane-Client-Source"] = this.source;
    }

    const response = await this.fetch(url.toString(), {
      method: "get",
      headers,
    });

    if (response.status >= 200 && response.status < 300) {
      return (await response.json()) as Output;
    }

    throw await HTTPError.newFromResponse(response);
  }

  async post<Output = unknown>(path: string, body?: Record<string, unknown>): Promise<Output> {
    const url = new URL(this.host);
    url.pathname = path;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "X-Airplane-Client-Kind": "sdk/node",
      "X-Airplane-Client-Version": pkg.version,
    };
    if (this.token) {
      headers["X-Airplane-Token"] = this.token;
    }
    if (this.apiKey) {
      headers["X-Airplane-API-Key"] = this.apiKey;
    }
    if (this.envID) {
      headers["X-Airplane-Env-ID"] = this.envID;
    }
    if (this.envSlug) {
      headers["X-Airplane-Env-Slug"] = this.envSlug;
    }
    if (this.source) {
      headers["X-Airplane-Client-Source"] = this.source;
    }

    const response = await this.fetch(url.toString(), {
      method: "post",
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });

    if (response.status >= 200 && response.status < 300) {
      return (await response.json()) as Output;
    }

    throw await HTTPError.newFromResponse(response);
  }
}

export class HTTPError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = "HTTPError";
    this.code = code;
  }

  static async newFromResponse(response: Response): Promise<HTTPError> {
    // Attempt to parse the response as an error message:
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.indexOf("application/json") > -1) {
      try {
        const resp = (await response.json()) as { error?: string };
        if (resp.error) {
          return new HTTPError(resp.error, response.status);
        }
      } catch {
        // continue...
      }
    }

    return new HTTPError(
      `Request failed: ${response.status}: ${response.statusText}`,
      response.status
    );
  }
}
