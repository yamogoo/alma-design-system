import { mount } from "@vue/test-utils";

import type { AnimatedWrapperProps } from "@/components/atoms/containers/AnimatedWrapper";
import AnimatedWrapper from "./AnimatedWrapper.vue";

const REQUIRED_PROPS: AnimatedWrapperProps = {
  contentKey: "some-key",
};

describe("AnimatedWrapper", () => {
  describe("slots", () => {
    test("should render default slot", () => {
      const slotContent = "Slot Content";
      const slot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mount(AnimatedWrapper, {
        props: REQUIRED_PROPS,
        slots: { default: slot },
      });

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Slot Content"`);
    });
  });
});
