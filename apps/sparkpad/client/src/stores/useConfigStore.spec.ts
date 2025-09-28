import { useConfigStore } from "./useConfigStore";

describe("useConfigStore", () => {
  /* * * Settings * * */

  test("should set a theme", () => {
    const store = useConfigStore();

    store.setTheme("dark");
    expect(store.currentTheme).toBe("dark");
    expect(store.getSid).toBe(1);

    store.setTheme("light");
    expect(store.currentTheme).toBe("light");
    expect(store.getSid).toBe(0);
  });

  /* * * Common * * */

  test("should set currentVersion", () => {
    const store = useConfigStore();

    store.setCurrentPackageVersion("1");
    expect(store.currentPackageVersion).toBe("1");

    store.setCurrentPackageVersion("2");
    expect(store.currentPackageVersion).toBe("2");
  });
});
