import { Run, RunStatus } from "./api/types";
import { RunTerminationError } from "./errors";

test("RunTerminationError", () => {
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
    throw new RunTerminationError(run);
  } catch (err: unknown) {
    if (err instanceof RunTerminationError) {
      expect(err.name).toBe("RunTerminationError");
      expect(err.message).toBe("Run failed");
      expect(err.run).toBe(run);
    } else {
      fail("err is not a RunTerminationError");
    }
  }
});
