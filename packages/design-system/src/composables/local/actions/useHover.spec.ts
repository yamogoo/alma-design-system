import { ref, defineComponent } from "vue";
import { mount } from "@vue/test-utils";

import { useHover } from "./useHover";

describe("useHover composable", () => {
  test("sets isHovered true on pointerenter and false on pointerleave", () => {
    const Wrapper = defineComponent({
      template: `<div ref="el"></div>`,
      setup() {
        const el = ref<HTMLElement | null>(null);
        const { isHovered } = useHover(el);
        return { el, isHovered };
      },
    });

    const wrapper = mount(Wrapper);
    const el = wrapper.vm.el as HTMLElement;

    expect(wrapper.vm.isHovered).toBe(false);

    el.dispatchEvent(new PointerEvent("pointerenter"));
    expect(wrapper.vm.isHovered).toBe(true);

    el.dispatchEvent(new PointerEvent("pointerleave"));
    expect(wrapper.vm.isHovered).toBe(false);
  });

  test("adds and removes event listeners on mount/unmount", () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();

    const Wrapper = defineComponent({
      template: `<div ref="el"></div>`,
      setup() {
        const el = ref<HTMLElement | null>(null);

        Object.defineProperty(el, "value", {
          get: () => ({ addEventListener, removeEventListener }),
          set: () => {},
        });

        useHover(el);
        return { el };
      },
    });

    const wrapper = mount(Wrapper);

    expect(addEventListener).toHaveBeenCalledWith(
      "pointerenter",
      expect.any(Function)
    );
    expect(addEventListener).toHaveBeenCalledWith(
      "pointerleave",
      expect.any(Function)
    );

    wrapper.unmount();

    expect(removeEventListener).toHaveBeenCalledWith(
      "pointerenter",
      expect.any(Function)
    );
    expect(removeEventListener).toHaveBeenCalledWith(
      "pointerleave",
      expect.any(Function)
    );
  });
});
