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
  airplane.output("hello world", { catchphrase: "that's too much, man!" });

  expectLogs([
    `airplane_output:"hello" "world"`,
    `airplane_output:"hello" null`,
    `airplane_output:"hello" null`,
    `airplane_output:"hello" true`,
    `airplane_output:"hello" false`,
    `airplane_output:"hello" 123`,
    `airplane_output:"hello" 123.456`,
    `airplane_output:"hello" ["hello","world"]`,
    `airplane_output:"hello" {"catchphrase":"that's too much, man!"}`,
    `airplane_output:"hello world" {"catchphrase":"that's too much, man!"}`,
  ]);
});

test("set/append values without paths", () => {
  airplane.setOutput("world");
  airplane.setOutput(undefined);
  airplane.setOutput(null);
  airplane.setOutput(true);
  airplane.setOutput(false);
  airplane.setOutput(123);
  airplane.setOutput(123.456);
  airplane.setOutput(["hello", "world"]);
  airplane.setOutput({ catchphrase: "that's too much, man!" });
  airplane.appendOutput("world");
  airplane.appendOutput(undefined);
  airplane.appendOutput(null);
  airplane.appendOutput(true);
  airplane.appendOutput(false);
  airplane.appendOutput(123);
  airplane.appendOutput(123.456);
  airplane.appendOutput(["hello", "world"]);
  airplane.appendOutput({ catchphrase: "that's too much, man!" });

  expectLogs([
    `airplane_output_set "world"`,
    `airplane_output_set null`,
    `airplane_output_set null`,
    `airplane_output_set true`,
    `airplane_output_set false`,
    `airplane_output_set 123`,
    `airplane_output_set 123.456`,
    `airplane_output_set ["hello","world"]`,
    `airplane_output_set {"catchphrase":"that's too much, man!"}`,
    `airplane_output_append "world"`,
    `airplane_output_append null`,
    `airplane_output_append null`,
    `airplane_output_append true`,
    `airplane_output_append false`,
    `airplane_output_append 123`,
    `airplane_output_append 123.456`,
    `airplane_output_append ["hello","world"]`,
    `airplane_output_append {"catchphrase":"that's too much, man!"}`,
  ]);
});

test("set/append values with paths", () => {
  airplane.setOutput("world", "abc", `de \\"f`, "ghi", 0);
  airplane.setOutput(undefined, "abc", `de "f`, "ghi", 0);
  airplane.setOutput(null, "abc", `de "f`, "ghi", 0);
  airplane.setOutput(true, "abc", `de "f`, "ghi", 0);
  airplane.setOutput(false, "abc", `de "f`, "ghi", 0);
  airplane.setOutput(123, "abc", `de "f`, "ghi", 0);
  airplane.setOutput(123.456, "abc", `de "f`, "ghi", 0);
  airplane.setOutput(["hello", "world"], "abc", `de "f`, "ghi", 0);
  airplane.setOutput(
    { catchphrase: "that's too much, man!" },
    "abc",
    `de "f`,
    "ghi",
    0
  );
  airplane.appendOutput("world", "abc", `de "f`, "ghi", 0);
  airplane.appendOutput(undefined, "abc", `de "f`, "ghi", 0);
  airplane.appendOutput(null, "abc", `de "f`, "ghi", 0);
  airplane.appendOutput(true, "abc", `de "f`, "ghi", 0);
  airplane.appendOutput(false, "abc", `de "f`, "ghi", 0);
  airplane.appendOutput(123, "abc", `de "f`, "ghi", 0);
  airplane.appendOutput(123.456, "abc", `de "f`, "ghi", 0);
  airplane.appendOutput(["hello", "world"], "abc", `de "f`, "ghi", 0);
  airplane.appendOutput(
    { catchphrase: "that's too much, man!" },
    "abc",
    `de "f`,
    "ghi",
    0
  );

  expectLogs([
    `airplane_output_set:abc["de \\\\\\"f"].ghi[0] "world"`,
    `airplane_output_set:abc["de \\"f"].ghi[0] null`,
    `airplane_output_set:abc["de \\"f"].ghi[0] null`,
    `airplane_output_set:abc["de \\"f"].ghi[0] true`,
    `airplane_output_set:abc["de \\"f"].ghi[0] false`,
    `airplane_output_set:abc["de \\"f"].ghi[0] 123`,
    `airplane_output_set:abc["de \\"f"].ghi[0] 123.456`,
    `airplane_output_set:abc["de \\"f"].ghi[0] ["hello","world"]`,
    `airplane_output_set:abc["de \\"f"].ghi[0] {"catchphrase":"that's too much, man!"}`,
    `airplane_output_append:abc["de \\"f"].ghi[0] "world"`,
    `airplane_output_append:abc["de \\"f"].ghi[0] null`,
    `airplane_output_append:abc["de \\"f"].ghi[0] null`,
    `airplane_output_append:abc["de \\"f"].ghi[0] true`,
    `airplane_output_append:abc["de \\"f"].ghi[0] false`,
    `airplane_output_append:abc["de \\"f"].ghi[0] 123`,
    `airplane_output_append:abc["de \\"f"].ghi[0] 123.456`,
    `airplane_output_append:abc["de \\"f"].ghi[0] ["hello","world"]`,
    `airplane_output_append:abc["de \\"f"].ghi[0] {"catchphrase":"that's too much, man!"}`,
  ]);
});

test("chunking", () => {
  airplane.setOutput("a".repeat(10000));
  airplane.appendOutput("a".repeat(10000));

  expect(log.mock.calls.length).toBe(6);
  const getMatches: (line: string) => { chunkKey: string; remainder: string } =
    (line) => {
      const chunkRegex = /^airplane_chunk(?:|_end):([^ ]*)(?:$| (.*)$)/;
      const matches = line.match(chunkRegex);
      return {
        chunkKey: matches && matches[1] ? matches[1] : "",
        remainder: matches && matches[2] ? matches[2] : "",
      };
    };

  {
    let { chunkKey, remainder } = getMatches(log.mock.calls[0][0]);
    const { chunkKey: chunkKey2, remainder: remainder2 } = getMatches(
      log.mock.calls[1][0]
    );
    expect(chunkKey).toBe(chunkKey2);
    remainder += remainder2;
    const { chunkKey: chunkKey3, remainder: remainder3 } = getMatches(
      log.mock.calls[2][0]
    );
    expect(chunkKey).toBe(chunkKey3);
    expect(remainder3).toBe("");
    expect(remainder).toBe(`airplane_output_set "${"a".repeat(10000)}"`);
  }

  {
    let { chunkKey, remainder } = getMatches(log.mock.calls[3][0]);
    const { chunkKey: chunkKey2, remainder: remainder2 } = getMatches(
      log.mock.calls[4][0]
    );
    expect(chunkKey).toBe(chunkKey2);
    remainder += remainder2;
    const { chunkKey: chunkKey3, remainder: remainder3 } = getMatches(
      log.mock.calls[5][0]
    );
    expect(chunkKey).toBe(chunkKey3);
    expect(remainder3).toBe("");
    expect(remainder).toBe(`airplane_output_append "${"a".repeat(10000)}"`);
  }
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
