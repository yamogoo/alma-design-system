import { defineComponent } from "vue";
import { mount } from "@vue/test-utils";

import { useConnection } from "./useConnection";

const setIsConnected = vi.fn();

vi.mock("@@/stores", () => ({
  useConnectionStore: vi.fn(() => ({ setIsConnected })),
}));

describe("useConnection", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mountComposable = () =>
    mount(
      defineComponent({
        setup() {
          useConnection();
          return () => null;
        },
      })
    );

  test("calls setIsConnected on mount with navigator.onLine = true", () => {
    vi.spyOn(window.navigator, "onLine", "get").mockReturnValue(true);

    mountComposable();

    expect(setIsConnected).toHaveBeenCalledWith(true);
  });

  test("calls setIsConnected on mount with navigator.onLine = false", () => {
    vi.spyOn(window.navigator, "onLine", "get").mockReturnValue(false);

    mountComposable();

    expect(setIsConnected).toHaveBeenCalledWith(false);
  });

  test("registers event listeners on mount", () => {
    const addSpy = vi.spyOn(window, "addEventListener");

    mountComposable();

    expect(addSpy).toHaveBeenCalledWith("online", expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith("offline", expect.any(Function));
  });

  test("removes event listeners on unmount", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const wrapper = mountComposable();
    wrapper.unmount();

    expect(removeSpy).toHaveBeenCalledWith("online", expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith("offline", expect.any(Function));
  });

  test("updates connection status on online/offline events", () => {
    const addSpy = vi.spyOn(window, "addEventListener");

    mountComposable();

    const onlineHandler = addSpy.mock.calls.find(
      (c) => c[0] === "online"
    )?.[1] as EventListener;
    const offlineHandler = addSpy.mock.calls.find(
      (c) => c[0] === "offline"
    )?.[1] as EventListener;

    vi.spyOn(window.navigator, "onLine", "get").mockReturnValue(true);
    onlineHandler(new Event("online"));
    expect(setIsConnected).toHaveBeenLastCalledWith(true);

    vi.spyOn(window.navigator, "onLine", "get").mockReturnValue(false);
    offlineHandler(new Event("offline"));
    expect(setIsConnected).toHaveBeenLastCalledWith(false);
  });
});
