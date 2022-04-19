type PollOptions = {
  // milliseconds to wait between requests
  delayMs: number;
};

type PollFunction<Output> = () => Promise<Output | null>;

// Poller continuously executes a function until a non-null response is returned. If `null` is returned,
// the poller will wait a configurable delay before retrying again.
export class Poller {
  private opts: PollOptions;

  constructor(opts: PollOptions) {
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
