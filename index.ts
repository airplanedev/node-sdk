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
    console.log(`airplane_output ${output}`);
  } else {
    if (typeof keyOrValue !== "string") {
      throw new Error("Expected keyOrValue to be type string");
    }
    const output = value === undefined ? null : JSON.stringify(value);
    console.log(`airplane_output:"${keyOrValue}" ${output}`);
  }
}

export default {
  output,
};
