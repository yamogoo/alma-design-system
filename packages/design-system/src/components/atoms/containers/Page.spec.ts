import { nextTick } from "vue";
import { mount } from "@vue/test-utils";

import Page from "./Page.vue";

describe("Page", () => {
  describe("slots", () => {
    test("should render default slot", async () => {
      const slotContent = "Slot Content";
      const slot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mount(Page, {
        slots: { default: slot },
      });

      await nextTick();

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Slot Content"`);
    });
  });
});
