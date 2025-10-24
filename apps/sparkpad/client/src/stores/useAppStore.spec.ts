import { APP_VERSION } from "@/constants";

import { useAppStore } from "./useAppStore";

describe("useAppStore", () => {
  test("should set version", () => {
    const expectedVersion = "v0.1.0";

    const store = useAppStore();

    store.setVersion(expectedVersion);

    expect(store.version).toBe(expectedVersion);
  });

  test("should reset store", () => {
    const expectedVersion = "v0.1.0";

    const store = useAppStore();

    store.setVersion(expectedVersion);
    store.reset();

    expect(store.version).toBe(APP_VERSION);
  });
});
