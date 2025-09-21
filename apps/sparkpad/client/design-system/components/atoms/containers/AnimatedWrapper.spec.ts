import { mount } from "@vue/test-utils";

import { AnimatedWrapper } from "@/components/atoms";

describe("AnimatedWrapper", () => {
  describe("slots", () => {
    test("should render default slot", async () => {
      const slotContent = "Slot Content";
      const slot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mount(AnimatedWrapper, {
        slots: { default: slot },
      });

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Slot Content"`);
    });
  });
});
