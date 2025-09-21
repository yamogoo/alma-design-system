import { createPinia, setActivePinia } from "pinia";

import { useConnectionStore } from "./useConnectionStore";

describe("useConnectionStore", () => {
  const pinia = createPinia();
  setActivePinia(pinia);

  const store = useConnectionStore();

  test("should change isConnected status", () => {
    store.setIsConnected(false);
    expect(store.isConnected).toBeFalsy();

    store.setIsConnected(true);
    expect(store.isConnected).toBeTruthy();
  });
});
