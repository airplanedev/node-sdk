import { task } from "./config";

describe("config", () => {
  describe("local execution", () => {
    it("executes a task with a simple param", async () => {
      const myTask = task(
        {
          slug: "hello",
          name: "Hello task",
          parameters: {
            name: {
              type: "shorttext",
              description: "Your name!",
            },
          },
        },
        (params) => {
          return `Hello ${params.name}!`;
        }
      );

      const res = await myTask({ name: "Lee" });
      expect(res).toBe("Hello Lee!");
    });

    it("executes a task with a simple shorthand param", async () => {
      const myTask = task(
        {
          slug: "hello",
          name: "Hello task",
          parameters: {
            name: "shorttext",
          },
        },
        (params) => {
          return `Hello ${params.name}!`;
        }
      );

      const res = await myTask({ name: "Lee" });
      expect(res).toBe("Hello Lee!");
    });

    it("executes a task with multiple params", async () => {
      const myTask = task(
        {
          slug: "hello",
          name: "Hello task",
          parameters: {
            name: {
              type: "shorttext",
              description: "Your name!",
            },
            greeting: {
              type: "longtext",
              description: "Greeting",
            },
            excited: {
              type: "boolean",
            },
          },
        },
        (params) => {
          return `${params.greeting} ${params.name}${params.excited ? "!" : "."}`;
        }
      );

      const res = await myTask({ name: "Lee", greeting: "Hi", excited: true });
      expect(res).toBe("Hi Lee!");
    });

    it("executes a task with an optional param", async () => {
      const myTask = task(
        {
          slug: "hello",
          name: "Hello task",
          parameters: {
            name: {
              type: "shorttext",
              description: "Your name!",
              default: "Lee",
              required: false,
            },
          },
        },
        (params) => {
          return `Hello ${params.name}!`;
        }
      );

      // TODO this should work
      // const res = await myTask();
      // expect(res).toBe("Hello Lee!");

      const res = await myTask({ name: "Colin" });
      expect(res).toBe("Hello Colin!");
    });

    it("executes a task with no params", async () => {
      const myTask = task(
        {
          slug: "hello",
          name: "Hello task",
        },
        () => {
          return `Hello!`;
        }
      );

      // TODO this should work
      // const res = await myTask();
      // expect(res).toBe("Hello!");

      const res = await myTask({});
      expect(res).toBe("Hello!");
    });
  });
});
