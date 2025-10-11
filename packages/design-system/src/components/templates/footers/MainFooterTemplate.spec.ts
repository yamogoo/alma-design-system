import { mount } from "@vue/test-utils";

import {
  MAIN_FOOTER_PREFIX,
  type MainFooterProps,
} from "@/components/templates/footers/MainFooterTemplate";
import MainFooterTemplate from "@/components/templates/footers/MainFooterTemplate.vue";

const Classes = {
  ROOT_CLASS: "main-footer",
  VARIANT: `${MAIN_FOOTER_PREFIX}_variant`,
  SIZE: `${MAIN_FOOTER_PREFIX}_size`,
  MODE: `${MAIN_FOOTER_PREFIX}_mode`,
  TONE: `${MAIN_FOOTER_PREFIX}_tone`,
};

describe("MainFooter", () => {
  describe("classes", () => {
    test("should have props based classes (variant/size)", () => {
      const props: MainFooterProps = {
        variant: "default",
        size: "lg",
        mode: "neutral",
        tone: "primary",
      };

      const wrapper = mount(MainFooterTemplate, { props });

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

      const wrapper = mount(MainFooterTemplate, {
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

      const wrapper = mount(MainFooterTemplate, {
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

      const wrapper = mount(MainFooterTemplate, {
        slots: { right: slot },
      });

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Slot Content"`);
    });
  });
});
