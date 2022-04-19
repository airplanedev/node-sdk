import nock from "nock";

import { Fetcher, HTTPError } from "./fetch";

beforeAll(() => {
  nock.disableNetConnect();
});

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
  const host = "http://localhost:51234";
  const tasks = [
    { id: "task1", name: "task 1" },
    { id: "task2", name: "task 2" },
  ];

  const fetcher = new Fetcher({
    host,
    token: "token123",
    // Reduce retry delay:
    retryDelay: () => 5,
  });

  test("no params", async () => {
    expect.assertions(1);
    nock(host).get("/v0/tasks/list").reply(200, tasks);
    expect(
      await fetcher.get<{
        id: string;
      }>("/v0/tasks/list")
    ).toStrictEqual(tasks);
  });

  test("with param", async () => {
    expect.assertions(1);
    nock(host).get("/v0/tasks/get?id=task1").reply(200, tasks[0]);
    expect(
      await fetcher.get<{
        id: string;
      }>("/v0/tasks/get", { id: "task1" })
    ).toStrictEqual(tasks[0]);
  });

  test("404", async () => {
    expect.assertions(1);
    nock(host).get("/v0/tasks/get?id=task3").reply(404, {
      error: "Task not found",
    });
    await expect(async () => {
      await fetcher.get<{
        id: string;
      }>("/v0/tasks/get", { id: "task3" });
    }).rejects.toThrow(new HTTPError("Task not found", 404));
  });

  test("400", async () => {
    expect.assertions(1);
    nock(host).get("/v0/tasks/get").reply(400, {
      error: "A taskID is required",
    });
    await expect(async () => {
      await fetcher.get<{
        id: string;
      }>("/v0/tasks/get");
    }).rejects.toThrow(new HTTPError("A taskID is required", 400));
  });

  test("500", async () => {
    expect.assertions(1);
    nock(host)
      .get("/v0/throw/error")
      .reply(500, {
        error: "An unexpected error occurred",
      })
      .persist(true);
    await expect(async () => {
      await fetcher.get("/v0/throw/error");
    }).rejects.toThrow(new HTTPError("An unexpected error occurred", 500));
  });
});

describe("post", () => {
  const host = "http://localhost:51234";

  const fetcher = new Fetcher({
    host,
    token: "token123",
    // Reduce retry delay:
    retryDelay: () => 5,
  });

  test("no body", async () => {
    expect.assertions(1);
    nock(host).post("/v0/tasks/create").reply(200, { id: "task1" });
    expect(
      await fetcher.post<{
        id: string;
      }>("/v0/tasks/create")
    ).toStrictEqual({ id: "task1" });
  });

  test("with body", async () => {
    expect.assertions(1);
    nock(host)
      .post("/v0/tasks/create", { name: "task 1" })
      .reply(200, { id: "task1", name: "task 1" });
    expect(
      await fetcher.post<{
        id: string;
      }>("/v0/tasks/create", { name: "task 1" })
    ).toStrictEqual({ id: "task1", name: "task 1" });
  });

  test("404", async () => {
    expect.assertions(1);
    nock(host).post("/v0/tasks/update", { id: "task2" }).reply(404, {
      error: "Task not found",
    });
    await expect(async () => {
      await fetcher.post<{
        id: string;
      }>("/v0/tasks/update", { id: "task2" });
    }).rejects.toThrow(new HTTPError("Task not found", 404));
  });

  test("400", async () => {
    expect.assertions(1);
    nock(host).post("/v0/tasks/update", {}).reply(404, {
      error: "A taskID is required",
    });
    await expect(async () => {
      await fetcher.post<{
        id: string;
      }>("/v0/tasks/update", {});
    }).rejects.toThrow(new HTTPError("A taskID is required", 400));
  });

  test("500", async () => {
    expect.assertions(1);
    nock(host)
      .post("/v0/throw/error")
      .reply(500, {
        error: "An unexpected error occurred",
      })
      .persist(true);
    await expect(async () => {
      await fetcher.post("/v0/throw/error");
    }).rejects.toThrow(new HTTPError("An unexpected error occurred", 500));
  });
});
