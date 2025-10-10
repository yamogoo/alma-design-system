import { mount } from "@vue/test-utils";

import Link from "./Link.vue";

describe("Link", () => {
  describe("slots", () => {
    test("renders default slot", () => {
      const slotContent = "Some Content";

      const wrapper = mount(Link, {
        slots: { default: `<p class="link__slot">${slotContent}</p>` },
      });

      const slot = wrapper.find(".link__slot");

      expect(slot.exists()).toBe(true);
      expect(slot.text()).toContain(slotContent);
    });
  });
});
