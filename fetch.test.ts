import nock from "nock";

import { Fetcher, HTTPError } from "./fetch";

test("validates options", () => {
  expect(() => {
    new Fetcher({
      host: "",
      token: "",
    });
  }).toThrowError("expected an api host");

  expect(() => {
    new Fetcher({
      host: "https://api.airplane.dev",
      token: "",
    });
  }).toThrowError("expected an authentication token");
});

describe("get", () => {
  const host = "https://api.airplane.dev";
  const tasks = [
    { id: "task1", name: "task 1" },
    { id: "task2", name: "task 2" },
  ];
  const scope = nock(host)
    .get("/v0/tasks/list")
    .reply(200, tasks)
    .get("/v0/tasks/get?id=task1")
    .reply(200, tasks[0])
    .get("/v0/tasks/get?id=task2")
    .reply(200, tasks[1])
    .get("/v0/tasks/get?id=task3")
    .reply(404, {
      error: "Task not found",
    })
    .get("/v0/tasks/get")
    .reply(400, {
      error: "A taskID is required",
    })
    .get("/v0/throw/error")
    .reply(500, {
      error: "An unexpected error occurred",
    })
    .persist(true);

  afterAll(() => {
    scope.persist(false);
    nock.cleanAll();
  });

  const fetcher = new Fetcher({
    host,
    token: "token123",
    // Reduce retry delay:
    retryDelay: () => 5,
  });

  test("no params", async () => {
    expect.assertions(1);
    expect(
      await fetcher.get<{
        id: string;
      }>("/v0/tasks/list")
    ).toStrictEqual(tasks);
  });

  test("with param", async () => {
    expect.assertions(1);
    expect(
      await fetcher.get<{
        id: string;
      }>("/v0/tasks/get", { id: "task1" })
    ).toStrictEqual(tasks[0]);
  });

  test("404", async () => {
    expect.assertions(1);
    await expect(async () => {
      await fetcher.get<{
        id: string;
      }>("/v0/tasks/get", { id: "task3" });
    }).rejects.toThrow(new HTTPError("Task not found", 404));
  });

  test("400", async () => {
    expect.assertions(1);
    await expect(async () => {
      await fetcher.get<{
        id: string;
      }>("/v0/tasks/get");
    }).rejects.toThrow(new HTTPError("A taskID is required", 400));
  });

  test("500", async () => {
    expect.assertions(1);
    await expect(async () => {
      await fetcher.get("/v0/throw/error");
    }).rejects.toThrow(new HTTPError("An unexpected error occurred", 500));
  });
});
