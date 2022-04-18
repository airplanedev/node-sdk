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
export function output(keyOrValue: string | any, value?: any) {
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
 * portion of the JSON output described by the path.
 *
 * The path should consist of multiple strings and/or integers. A string
 * indicates the value associated with a key in a JSON object, and an integer
 * indicates the index of an element in a (0-indexed) JSON array. For instance,
 * calling
 * <code>
 *  setOutput(4, "test", 3)
 * </code>
 * would update the 3 to a 4 in the following JSON object:
 * <code>
 *  {"test": [0, 1, 2, 3]}
 * </code>
 *
 * To learn more about Airplane outputs, see the docs: https://docs.airplane.dev/reference/outputs
 *
 * @example
 *   setOutput("Task completed successfully.")
 *
 * @example
 *   setOutput({"error": "Received a 500 from the upstream API"})
 *
 * @example
 *   setOutput("Received a 500 from the upstream API", "error")
 */
 export function setOutput(value: any, ...path: (string | number)[]) {
  const output = value === undefined ? null : JSON.stringify(value);
  const jsPath = toJSPath(path);
  const maybePath = jsPath ? `:${jsPath}` : "";
  logChunks(`airplane_output_set${maybePath} ${output}`);
}

/**
 * This appends `value` to the Airplane output. If a path is provided, it
 * appends at the portion of the JSON output described by the path.
 *
 * The path should consist of multiple strings and/or integers. A string
 * indicates the value associated with a key in a JSON object, and an integer
 * indicates the index of an element in a (0-indexed) JSON array. For instance,
 * calling
 * <code>
 *  appendOutput(4, "test", 3)
 * </code>
 * would append the 4 to the array containing the 3 in the following JSON object:
 * <code>
 *  {"test": [[0], [1], [2], [3]]}
 * </code>
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
export function appendOutput(value: any, ...path: (string | number)[]) {
  const output = value === undefined ? null : JSON.stringify(value);
  const jsPath = toJSPath(path);
  const maybePath = jsPath ? `:${jsPath}` : "";
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

function toJSPath(path: (string | number)[]) {
  let ret = "";
  for (let i = 0; i < path.length; i++) {
    const v = path[i];
    if (typeof v === "string") {
      if (v.match(/^\w+$/)) {
        if (i > 0) {
          ret += ".";
        }
        ret += v;
      } else {
        ret += `["` + v.replace(/\\/g, `\\\\`).replace(/"/g, `\\"`) + `"]`;
      }
    } else if (typeof v === "number") {
      ret += "[" + v + "]";
    }
  }
  return ret;
}
