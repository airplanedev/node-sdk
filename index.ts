import { v4 as uuidv4 } from "uuid";

/**
 * This produces an Airplane output (`value`) that is grouped with
 * other outputs with the same `key`. If a `key` is not provided,
 * a default key is used.
 * 
 * To learn more about Airplane outputs, see the docs: https://docs.airplane.dev/reference/outputs
 * 
 * @example
 *   output("Task completed successfully.")
 * 
 * @example
 *   output("error", "This is an error message")
 * 
 * @example
 *   output("rows", { "name": "Carolyn", "occupation": "agent" })
 */
function output(keyOrValue: string | any, value?: any) {
  if (arguments.length === 1) {
    const output = keyOrValue === undefined ? null : JSON.stringify(keyOrValue);
    logChunks(`airplane_output ${output}`);
  } else {
    if (typeof keyOrValue !== "string") {
      throw new Error("Expected keyOrValue to be type string");
    }
    const output = value === undefined ? null : JSON.stringify(value);
    logChunks(`airplane_output:"${keyOrValue}" ${output}`);
  }
}

function setOutput(value: any, path?: string) {
  const output = value === undefined ? null : JSON.stringify(value);
  const maybePath = path === undefined ? "" : `:${path}`;
  logChunks(`airplane_output_set${maybePath} ${output}`);
}

function appendOutput(value: any, path?: string) {
  const output = value === undefined ? null : JSON.stringify(value);
  const maybePath = path === undefined ? "" : `:${path}`;
  logChunks(`airplane_output_append${maybePath} ${output}`);
}

function logChunks(output: string) {
  const CHUNK_SIZE = 8192;
  if (output.length <= CHUNK_SIZE) {
    console.log(output);
  } else {
    const chunkKey = uuidv4();
    for (var i = 0; i < output.length; i += CHUNK_SIZE) {
      console.log(`airplane_chunk:${chunkKey} ${output.substr(i, CHUNK_SIZE)}`);
    }
    console.log(`airplane_chunk_end:${chunkKey}`);
  }
}

export default {
  appendOutput,
  output,
  setOutput,
};
