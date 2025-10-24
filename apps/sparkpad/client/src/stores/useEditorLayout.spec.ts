import { Constants } from "@/constants";

import { useEditorLayout } from "./useEditorLayout";

describe("useEditorLayout", () => {
  test("should set isNavigatorShown", () => {
    const store = useEditorLayout();

    store.setIsNavigatorShown(true);

    expect(store.isNavigatorShown).toBeTruthy();
  });

  test("should set navigatorWidth", () => {
    const expectedWidth = Constants.DEFAULT_NAVIGATOR_WIDTH + 200;

    const store = useEditorLayout();

    store.setNavigatorWidth(expectedWidth);

    expect(store.navigatorWidth).toBe(expectedWidth);
  });

  test("should reset store", () => {
    const store = useEditorLayout();

    store.setNavigatorWidth(Constants.DEFAULT_NAVIGATOR_WIDTH + 200);
    store.setIsNavigatorShown(!Constants.DEFAULT_IS_NAVIGATOR_SHOWN);
    store.reset();

    expect(store.navigatorWidth).toBe(Constants.DEFAULT_NAVIGATOR_WIDTH);
    expect(store.isNavigatorShown).toBe(Constants.DEFAULT_IS_NAVIGATOR_SHOWN);
  });
});
