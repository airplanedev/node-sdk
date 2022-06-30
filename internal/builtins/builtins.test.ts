import { convertResourceAliasToID } from "./builtins";

describe("env", () => {
  const env = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
  });

  afterEach(() => {
    process.env = env;
  });

  test("missing_resource_version", () => {
    expect(() => {
      convertResourceAliasToID("foo");
    }).toThrow();
  });

  test("unsupported_resource_version", () => {
    process.env.AIRPLANE_RESOURCES_VERSION = "3";

    expect(() => {
      convertResourceAliasToID("foo");
    }).toThrow();
  });

  test("missing_alias", () => {
    process.env.AIRPLANE_RESOURCES_VERSION = "2";
    process.env.AIRPLANE_RESOURCES = "{}";

    expect(() => {
      convertResourceAliasToID("foo");
    }).toThrow();
  });

  test("missing_id", () => {
    process.env.AIRPLANE_RESOURCES_VERSION = "2";
    process.env.AIRPLANE_RESOURCES = `{"foo": {}}`;

    expect(() => {
      convertResourceAliasToID("foo");
    }).toThrow();
  });

  test("converts_alias", () => {
    process.env.AIRPLANE_RESOURCES_VERSION = "2";
    process.env.AIRPLANE_RESOURCES = `{"foo": {"id": "bar"}}`;

    expect(convertResourceAliasToID("foo")).toBe("bar");
  });
});
