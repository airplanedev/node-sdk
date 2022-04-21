import { Poller } from "./poll";

test("retries multiple times", async () => {
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

test("stops on error", async () => {
  expect.assertions(2);

  const poller = new Poller({ delayMs: 5 });

  let count = 0;
  try {
    await poller.run(() => {
      count++;
      throw new Error("whoops");
    });
  } catch (err) {
    expect(err).toStrictEqual(new Error("whoops"));
  }

  expect(count).toBe(1);
});
