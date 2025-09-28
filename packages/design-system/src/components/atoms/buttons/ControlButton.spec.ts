import { mount } from "@vue/test-utils";

import ControlButton from "./ControlButton.vue";
import type { ControlButtonProps } from "./ControlButton";

const REQUIRED_PROPS: ControlButtonProps = {
  size: "sm",
  mode: "neutral",
  tone: "secondary",
  iconName: "function",
  iconStyle: "outline",
  iconWeight: "100",
};

describe("ActionButton", () => {
  describe("components", () => {
    test("should render Button component", () => {
      const wrapper = mount(ControlButton, {
        props: { ...REQUIRED_PROPS },
      });

      const buttonEl = wrapper.find('[data-testid="button"]');
      const isButtonExists = buttonEl.exists();

      expect(isButtonExists).toBeTruthy();
      expect(isButtonExists).toMatchInlineSnapshot(`true`);
    });
  });

  describe("events", () => {
    test("should emit 'press' and 'release' events", async () => {
      const wrapper = mount(ControlButton, {
        props: { ...REQUIRED_PROPS },
      });

      await wrapper.trigger("pointerdown");
      expect(wrapper.emitted("press")).toBeTruthy();

      await wrapper.trigger("pointerup");
      expect(wrapper.emitted("release")).toBeTruthy();
    });
  });
});
