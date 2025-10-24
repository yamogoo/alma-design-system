import { useSettingsStore } from "./useSettingsStore";

describe("useSettingsStore", () => {
  test("should set isOpen", () => {
    const store = useSettingsStore();

    store.setIsOpen(true);
    expect(store.isOpen).toBeTruthy();

    store.setIsOpen(false);
    expect(store.isOpen).toBeFalsy();
  });

  test("should reset store", () => {
    const store = useSettingsStore();

    store.setIsOpen(true);
    store.reset();

    expect(store.isOpen).toBeFalsy();
  });
});
