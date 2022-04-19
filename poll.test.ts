import { Poller } from "./poll";

test("should retry 5 times", async () => {
  expect.assertions(1);

  const poller = new Poller({ delayMs: 5 });

  let count = 0;
  const out = await poller.run(() => {
    count++;
    if (count < 5) {
      return null;
    }
    return count;
  });

  expect(out).toBe(5);
});
