type PollerOptions = {
  // milliseconds to wait between requests
  delayMs: number;
};

type PollFunction<Output> = () => Output | null | Promise<Output | null>;

// Poller continuously executes a function until a non-null response is returned. If `null` is returned,
// the poller will wait a configurable delay before retrying again.
export class Poller {
  private opts: PollerOptions;

  constructor(opts: PollerOptions) {
    this.opts = opts;
  }

  async run<Output = unknown>(fn: PollFunction<Output>): Promise<Output> {
    return new Promise((resolve, reject) => {
      const fnw = async () => {
        try {
          const out = await fn();
          if (out !== null) {
            return resolve(out);
          }
        } catch (err) {
          return reject(err);
        }

        setTimeout(fnw, this.opts.delayMs);
      };

      fnw();
    });
  }
}
