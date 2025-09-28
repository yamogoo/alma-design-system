import { useLocaleStore } from "./useLocaleStore";

describe("useLocaleStore", () => {
  test("should set the locale", () => {
    const store = useLocaleStore();

    store.setLocale("en");
    expect(store.currentLocale).toBe("en");

    store.setLocale("ru");
    expect(store.currentLocale).toBe("ru");
  });
});
