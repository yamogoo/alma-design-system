import { defineComponent } from "vue";
import { mount } from "@vue/test-utils";

import { useAppLayout } from "./useAppLayout";

const setAppSize = vi.fn();

vi.mock("@/stores", () => ({
  useLayoutStore: vi.fn(() => ({ setAppSize })),
}));

const mountComposable = (selector = "#app") =>
  mount(
    defineComponent({
      setup() {
        useAppLayout(selector);
        return () => null;
      },
    })
  );

describe("useAppLayout", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    setAppSize.mockClear();
  });

  test("registers resize listener on mount", () => {
    const addSpy = vi.spyOn(window, "addEventListener");

    mountComposable();

    expect(addSpy).toHaveBeenCalledWith("resize", expect.any(Function));
  });

  test("removes resize listener on unmount", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const wrapper = mountComposable();
    const resizeHandler = addSpy.mock.calls.find(
      (call) => call[0] === "resize"
    )?.[1];

    wrapper.unmount();

    expect(typeof resizeHandler).toBe("function");
    expect(removeSpy).toHaveBeenCalledWith("resize", resizeHandler);
  });

  test("updates layout size on resize when element exists", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const querySpy = vi
      .spyOn(document, "querySelector")
      .mockReturnValue({
        getBoundingClientRect: () => ({ width: 640, height: 360 }),
      } as unknown as Element);

    mountComposable();

    const resizeHandler = addSpy.mock.calls.find(
      (call) => call[0] === "resize"
    )?.[1] as EventListener | undefined;

    expect(typeof resizeHandler).toBe("function");

    resizeHandler?.(new Event("resize"));

    expect(querySpy).toHaveBeenCalledWith("#app");
    expect(setAppSize).toHaveBeenCalledWith({ width: 640, height: 360 });
  });

  test("skips layout update when element is not found", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    vi.spyOn(document, "querySelector").mockReturnValue(null);

    mountComposable(".workspace");

    const resizeHandler = addSpy.mock.calls.find(
      (call) => call[0] === "resize"
    )?.[1] as EventListener | undefined;

    expect(typeof resizeHandler).toBe("function");

    resizeHandler?.(new Event("resize"));

    expect(setAppSize).not.toHaveBeenCalled();
  });
});
