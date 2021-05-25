import { jest } from "@jest/globals";
import airplane from "./index";

const log = jest.spyOn(console, "log");

test("output values without keys", () => {
  airplane.output("world");
  airplane.output(undefined);
  airplane.output(null);
  airplane.output(true);
  airplane.output(false);
  airplane.output(123);
  airplane.output(123.456);
  airplane.output(["hello", "world"]);
  airplane.output({ catchphrase: "that's too much, man!" });

  expectLogs([
    `airplane_output "world"`,
    `airplane_output null`,
    `airplane_output null`,
    `airplane_output true`,
    `airplane_output false`,
    `airplane_output 123`,
    `airplane_output 123.456`,
    `airplane_output ["hello","world"]`,
    `airplane_output {"catchphrase":"that's too much, man!"}`,
  ]);
});

test("output values with keys", () => {
  airplane.output("hello", "world");
  airplane.output("hello", undefined);
  airplane.output("hello", null);
  airplane.output("hello", true);
  airplane.output("hello", false);
  airplane.output("hello", 123);
  airplane.output("hello", 123.456);
  airplane.output("hello", ["hello", "world"]);
  airplane.output("hello", { catchphrase: "that's too much, man!" });

  expectLogs([
    `airplane_output:hello "world"`,
    `airplane_output:hello null`,
    `airplane_output:hello null`,
    `airplane_output:hello true`,
    `airplane_output:hello false`,
    `airplane_output:hello 123`,
    `airplane_output:hello 123.456`,
    `airplane_output:hello ["hello","world"]`,
    `airplane_output:hello {"catchphrase":"that's too much, man!"}`,
  ]);
});

function expectLogs(logs: string[]) {
  expect(log.mock.calls.length).toBe(logs.length);
  for (let i = 0; i < logs.length; i++) {
    expect(log.mock.calls[i][0]).toBe(logs[i]);
  }
}

afterEach(() => {
  jest.clearAllMocks();
});
