import { Run, RunStatus } from "./api/types";
import { RunError } from "./errors";

test("RunError", () => {
  const run: Run = {
    id: "run123",
    output: "hello world",
    paramValues: {
      name: "world",
    },
    status: RunStatus.Failed,
    taskID: "tsk123",
  };

  try {
    throw new RunError(run);
  } catch (err: unknown) {
    if (err instanceof RunError) {
      expect(err.name).toBe("RunError");
      expect(err.message).toBe("Run failed");
      expect(err.run).toBe(run);
    } else {
      fail("err is not a RunError");
    }
  }
});
