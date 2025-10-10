import { mount, VueWrapper } from "@vue/test-utils";

import { BUTTON_PREFIX } from "@/components/atoms/buttons/Button";

import type { ActionButtonProps } from "./ActionButton";
import ActionButton from "./ActionButton.vue";

export const getButtonIconByClassName = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`[data-testid="${BUTTON_PREFIX}__icon"]`);
};

const REQUIRED_PROPS: ActionButtonProps = {
  size: "sm",
  tone: "secondary",
  mode: "neutral",
};

describe("ActionButton", () => {
  describe("elements", () => {
    test("should render Button component", () => {
      const wrapper = mount(ActionButton, {
        props: { ...REQUIRED_PROPS },
      });

      const buttonEl = wrapper.find(`[data-testid="${BUTTON_PREFIX}"]`);
      const isButtonExists = buttonEl.exists();

      expect(isButtonExists).toBeTruthy();
      expect(isButtonExists).toMatchInlineSnapshot(`true`);
    });

    test("should render icon via props", () => {
      const wrapper = mount(ActionButton, {
        props: {
          ...REQUIRED_PROPS,
          ...{
            iconName: "check",
            iconStyle: "outline",
            iconWeight: "400",
          },
        },
      });

      const iconEl = getButtonIconByClassName(wrapper);

      expect(iconEl.exists()).toBeTruthy();
    });
  });

  describe("events", () => {
    test("should emit 'press' and 'release' events", async () => {
      const wrapper = mount(ActionButton, {
        props: { ...REQUIRED_PROPS },
      });

      await wrapper.trigger("pointerdown");
      expect(wrapper.emitted("press")).toBeTruthy();

      await wrapper.trigger("pointerup");
      expect(wrapper.emitted("release")).toBeTruthy();
    });
  });
});
