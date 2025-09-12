import { mount } from "@vue/test-utils";

import MainFooter from "./MainFooter.vue";
import type { MainFooterProps } from "./index";

enum Classes {
  ROOT_CLASS = "main-header",
  VARIANT = `${Classes.ROOT_CLASS}_variant`,
  SIZE = `${Classes.ROOT_CLASS}_size`,
  MODE = `${Classes.ROOT_CLASS}_mode`,
  TONE = `${Classes.ROOT_CLASS}_tone`,
}

describe("MainHeader", () => {
  describe("classes", () => {
    test("should have props based classes (variant/size)", async () => {
      const props: MainFooterProps = {
        variant: "default",
        size: "md",
        tone: "neutral",
        mode: "primary",
      };

      const wrapper = mount(MainFooter, { props });

      expect(wrapper.classes()).toContain(
        `${Classes.VARIANT}-${props.variant}`
      );
      expect(wrapper.classes()).toContain(`${Classes.SIZE}-${props.size}`);
      expect(wrapper.classes()).toContain(`${Classes.TONE}-${props.tone}`);
      expect(wrapper.classes()).toContain(`${Classes.MODE}-${props.mode}`);
    });
  });

  describe("slots", () => {
    test("should render default slot", async () => {
      const slotContent = "Slot Content";
      const slot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mount(MainFooter, {
        slots: { default: slot },
      });

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Slot Content"`);
    });

    test("should render left section slot", async () => {
      const slotContent = "Slot Content";
      const slot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mount(MainFooter, {
        slots: { left: slot },
      });

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Slot Content"`);
    });

    test("should render right section slot", async () => {
      const slotContent = "Slot Content";
      const slot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mount(MainFooter, {
        slots: { right: slot },
      });

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Slot Content"`);
    });
  });
});
