import { mount } from "@vue/test-utils";

import {
  MAIN_HEADER_PREFIX,
  type MainHeaderProps,
} from "@/components/templates/headers/MainHeaderTemplate";
import MainHeaderTemplate from "@/components/templates/headers/MainHeaderTemplate.vue";

const Classes = {
  ROOT_CLASS: MAIN_HEADER_PREFIX,
  VARIANT: `${MAIN_HEADER_PREFIX}_variant`,
  SIZE: `${MAIN_HEADER_PREFIX}_size`,
  MODE: `${MAIN_HEADER_PREFIX}_mode`,
  TONE: `${MAIN_HEADER_PREFIX}_tone`,
};

describe("MainHeader", () => {
  describe("classes", () => {
    test("should have props based classes (variant/size)", () => {
      const props: MainHeaderProps = {
        variant: "default",
        size: "md",
        mode: "neutral",
        tone: "primary",
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
    test("should render default slot", () => {
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

    test("should render left section slot", () => {
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

    test("should render right section slot", () => {
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
