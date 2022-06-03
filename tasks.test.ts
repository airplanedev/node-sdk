import nock from "nock";

import { execute, RunStatus } from "./tasks";

const OLD_ENV = process.env;

describe("execute", () => {
  const host = "http://localhost:51234";

  beforeEach(() => {
    process.env = OLD_ENV;

    nock.disableNetConnect();
    expect.assertions(1);
    nock(host)
      .post("/v0/tasks/execute", {
        slug: "hello_world",
        paramValues: {
          name: "colin",
        },
      })
      .reply(200, {
        runID: "run123",
      })
      .get("/v0/runs/get?id=run123")
      .reply(200, {
        id: "run123",
        status: RunStatus.Succeeded,
        paramValues: { name: "colin" },
        taskID: "task123",
      })
      .get("/v0/runs/getOutputs?id=run123")
      .reply(200, {
        output: "hello, colin!",
      });
  });
  test("with token from env var", async () => {
    process.env.AIRPLANE_API_HOST = host;
    process.env.AIRPLANE_TOKEN = "token123";

    const run = await execute<string>("hello_world", {
      name: "colin",
    });
    expect(run).toStrictEqual({
      id: "run123",
      taskID: "task123",
      paramValues: { name: "colin" },
      status: RunStatus.Succeeded,
      output: "hello, colin!",
    });
  });

  test("with passed in token and host", async () => {
    const run = await execute<string>(
      "hello_world",
      {
        name: "colin",
      },
      {
        host,
        token: "token123",
      }
    );
    expect(run).toStrictEqual({
      id: "run123",
      taskID: "task123",
      paramValues: { name: "colin" },
      status: RunStatus.Succeeded,
      output: "hello, colin!",
    });
  });
});
