import { getRuntime } from "./runtime";

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
export const setOutput = (value: unknown, ...path: (string | number)[]) => {
  const output = value === undefined ? null : JSON.stringify(value);
  const jsPath = toJSPath(path);
  const maybePath = jsPath ? `:${jsPath}` : "";
  getRuntime().logChunks(`airplane_output_set${maybePath} ${output}`);
};

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
export const appendOutput = (value: unknown, ...path: (string | number)[]) => {
  const output = value === undefined ? null : JSON.stringify(value);
  const jsPath = toJSPath(path);
  const maybePath = jsPath ? `:${jsPath}` : "";
  getRuntime().logChunks(`airplane_output_append${maybePath} ${output}`);
};

const toJSPath = (path: (string | number)[]) => {
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
};
