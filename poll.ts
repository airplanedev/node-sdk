type PollOptions = {
  // milliseconds to wait between requests to fn
  delayMs: number
}

type PollFunction<Output> = () => (Promise<Output | null>)

export class Poller {
  private opts: PollOptions

  constructor(opts: PollOptions) {
    this.opts = opts
  }

  // run continuously executes `fn` with a configurable delay in between calls to `fn`.
  // 
  // If `fn` returns `null`, it will wait a configurable delay and retry.
  // 
  // Useful for polling APIs.
  async run<Output = unknown>(fn: PollFunction<Output>): Promise<Output> {
    return new Promise(async (resolve, reject) => {
      const fnw = async () => {
        try {
          const out = await fn()
          if (out != null) {
            return resolve(out)
          }
        } catch (err) {
          return reject(err)
        }
  
        setTimeout(fnw, this.opts.delayMs)
      }
  
      fnw()
    })
  }
}
