import { defineComponent, ref } from "vue";
import { mount } from "@vue/test-utils";

import { usePressed } from "./usePressed";

describe("usePressed", () => {
  test("adds and removes event listeners on mount and unmount", () => {
    const addSpy = vi.fn();
    const removeSpy = vi.fn();

    const el = {
      addEventListener: addSpy,
      removeEventListener: removeSpy,
    } as unknown as HTMLElement;

    const Wrapper = defineComponent({
      template: `<div></div>`,
      setup() {
        const elRef = ref<HTMLElement | null>(el);
        return usePressed(elRef);
      },
    });

    const wrapper = mount(Wrapper);

    expect(addSpy).toHaveBeenCalledTimes(3);
    expect(addSpy).toHaveBeenCalledWith("pointerdown", expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith("pointerup", expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith("pointerleave", expect.any(Function));

    wrapper.unmount();

    expect(removeSpy).toHaveBeenCalledTimes(3);
    expect(removeSpy).toHaveBeenCalledWith("pointerdown", expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith("pointerup", expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith(
      "pointerleave",
      expect.any(Function)
    );
  });

  test("sets isPressed true on pointerdown and false on pointerup/pointerleave", async () => {
    const Wrapper = defineComponent({
      template: `<div ref="el"></div>`,
      setup() {
        const el = ref<HTMLElement | null>(null);
        const { isPressed } = usePressed(el);
        return { el, isPressed };
      },
    });

    const wrapper = mount(Wrapper);
    const el = wrapper.vm.el as HTMLElement;

    expect(wrapper.vm.isPressed).toBe(false);

    el.dispatchEvent(new PointerEvent("pointerdown"));
    expect(wrapper.vm.isPressed).toBe(true);

    el.dispatchEvent(new PointerEvent("pointerup"));
    expect(wrapper.vm.isPressed).toBe(false);

    el.dispatchEvent(new PointerEvent("pointerdown"));
    expect(wrapper.vm.isPressed).toBe(true);

    el.dispatchEvent(new PointerEvent("pointerleave"));
    expect(wrapper.vm.isPressed).toBe(false);
  });

  test("returns correct scale value", () => {
    const Wrapper = defineComponent({
      template: `<div></div>`,
      setup() {
        const el = ref<HTMLElement | null>(null);
        return usePressed(el, 0.8);
      },
    });

    const wrapper = mount(Wrapper);
    expect(wrapper.vm.scale).toBe(0.8);
  });
});
