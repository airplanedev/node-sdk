import { v4 as uuidv4 } from "uuid";

/**
 * This produces an Airplane output (`value`) that is grouped with
 * other outputs with the same `key`. If a `key` is not provided,
 * a default key is used.
 *
 * To learn more about Airplane outputs, see the docs: https://docs.airplane.dev/reference/outputs
 *
 * @deprecated please use setOutput and appendOutput instead
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
/**
 * This sets the Airplane output (`value`). If a path is provided, it sets the
 * portion of the output described by the path. For path syntax, please see the docs.
 *
 * To learn more about Airplane outputs, see the docs: https://docs.airplane.dev/reference/outputs
 *
 * @example
 *   setOutput("Task completed successfully.")
 *
 * @example
 *   setOutput({"values": {"error": "This is an error message"}})
 *
 * @example
 *   setOutput("A different error message", "values.error")
 */
function setOutput(value: any, path?: string) {
  const output = value === undefined ? null : JSON.stringify(value);
  const maybePath = path === undefined ? "" : `:${path}`;
  logChunks(`airplane_output_set${maybePath} ${output}`);
}

/**
 * This appends `value` to the Airplane output. If a path is provided, it
 * appends at the portion of the output described by the path. For path syntax,
 * please see the docs.
 *
 * To learn more about Airplane outputs, see the docs: https://docs.airplane.dev/reference/outputs
 *
 * @example
 *   appendOutput("Task completed successfully.")
 *
 * @example
 *   appendOutput({"name": "Carolyn", "occupation": "agent"}, "rows")
 *
 */
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
    for (let i = 0; i < output.length; i += CHUNK_SIZE) {
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
