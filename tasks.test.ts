import nock from "nock";

import { execute, RunStatus } from "./tasks";

const OLD_ENV = process.env;
afterAll(() => {
  process.env = OLD_ENV;
});

test("execute", async () => {
  const host = "http://localhost:51234";
  nock.disableNetConnect();

  expect.assertions(1);

  process.env.AIRPLANE_API_HOST = host;
  process.env.AIRPLANE_TOKEN = "token123";

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
