import { Fetcher } from "./fetch";

test("validates options", () => {
  expect(() => {
    new Fetcher({
      host: "",
      token: "",
    });
  }).toThrowError("expected an api host");

  expect(() => {
    new Fetcher({
      host: "https://api.airplane.dev",
      token: "",
    });
  }).toThrowError("expected an authentication token");
});
