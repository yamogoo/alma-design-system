import { beforeEach, describe, expect, test } from "vitest";
import { useTitle } from "./useTitle";

describe("useTitle", () => {
  beforeEach(() => {
    document.title = "";
  });

  test("sets initial title", () => {
    useTitle("Hello");
    expect(document.title).toBe("Hello");
  });

  test("updates title via setTitle", () => {
    const { setTitle } = useTitle("Initial");
    expect(document.title).toBe("Initial");

    setTitle("Updated");
    expect(document.title).toBe("Updated");
  });

  test("reacts to title.value changes", async () => {
    const { title } = useTitle("Start");
    expect(document.title).toBe("Start");

    title.value = "Changed";

    await Promise.resolve();
    expect(document.title).toBe("Changed");
  });
});
