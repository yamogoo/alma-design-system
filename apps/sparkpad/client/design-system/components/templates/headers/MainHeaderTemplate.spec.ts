import { mount } from "@vue/test-utils";

import {
  MainHeaderTemplate,
  type MainHeaderProps,
} from "@/components/templates";

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
      const props: MainHeaderProps = {
        variant: "default",
        size: "md",
        tone: "neutral",
        mode: "primary",
      };

      const wrapper = mount(MainHeaderTemplate, { props });

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

      const wrapper = mount(MainHeaderTemplate, {
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

      const wrapper = mount(MainHeaderTemplate, {
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

      const wrapper = mount(MainHeaderTemplate, {
        slots: { right: slot },
      });

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Slot Content"`);
    });
  });
});
