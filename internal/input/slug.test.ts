import { makeSlug } from "./slug";

test("makeSlug", () => {
  const cases = [
    // no-op
    ["test", "test"],
    // removes casing
    ["TEST", "test"],
    // trims leading/trailing special characters
    ["-a-", "a"],
    // trims all whitespace
    [" test that it trims space\t ", "test_that_it_trims_space"],
    // removes special characters
    ["foo-–—―&@%bar", "foo_and_at_percent_bar"],
    // trims underscores
    ["_test_foo_bar_", "test_foo_bar"],
    // truncates long strings
    ["a".repeat(100), "a".repeat(50)],
    // trim duplicate __'s
    ["test____test", "test_test"],
  ];

  for (const [i, o] of cases) {
    expect(makeSlug(i)).toBe(o);
  }
});
