import { jest } from "@jest/globals";
import { setOutput, appendOutput } from './output'

const log = jest.spyOn(console, "log").mockImplementation(() => {});

test("set/append values without paths", () => {
  setOutput("world");
  setOutput(undefined);
  setOutput(null);
  setOutput(true);
  setOutput(false);
  setOutput(123);
  setOutput(123.456);
  setOutput(["hello", "world"]);
  setOutput({ catchphrase: "that's too much, man!" });
  appendOutput("world");
  appendOutput(undefined);
  appendOutput(null);
  appendOutput(true);
  appendOutput(false);
  appendOutput(123);
  appendOutput(123.456);
  appendOutput(["hello", "world"]);
  appendOutput({ catchphrase: "that's too much, man!" });

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
  setOutput("world", "abc", `de \\"f`, "ghi", 0);
  setOutput(undefined, "abc", `de "f`, "ghi", 0);
  setOutput(null, "abc", `de "f`, "ghi", 0);
  setOutput(true, "abc", `de "f`, "ghi", 0);
  setOutput(false, "abc", `de "f`, "ghi", 0);
  setOutput(123, "abc", `de "f`, "ghi", 0);
  setOutput(123.456, "abc", `de "f`, "ghi", 0);
  setOutput(["hello", "world"], "abc", `de "f`, "ghi", 0);
  setOutput(
    { catchphrase: "that's too much, man!" },
    "abc",
    `de "f`,
    "ghi",
    0
  );
  appendOutput("world", "abc", `de "f`, "ghi", 0);
  appendOutput(undefined, "abc", `de "f`, "ghi", 0);
  appendOutput(null, "abc", `de "f`, "ghi", 0);
  appendOutput(true, "abc", `de "f`, "ghi", 0);
  appendOutput(false, "abc", `de "f`, "ghi", 0);
  appendOutput(123, "abc", `de "f`, "ghi", 0);
  appendOutput(123.456, "abc", `de "f`, "ghi", 0);
  appendOutput(["hello", "world"], "abc", `de "f`, "ghi", 0);
  appendOutput(
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
  setOutput("a".repeat(10000));
  appendOutput("a".repeat(10000));

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
