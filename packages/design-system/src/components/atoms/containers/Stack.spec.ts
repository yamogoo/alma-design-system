import { mount } from "@vue/test-utils";

import { UIFACETS, UIMODIFIERS } from "@/constants/ui";

import { STACK_PREFIX, type StackProps } from "./Stack";
import Stack from "./Stack.vue";

const Classes = {
  ROOT_CLASS: STACK_PREFIX,
  VARIANT: `${STACK_PREFIX}_${UIFACETS.VARIANT}`,
  SIZE: `${STACK_PREFIX}_${UIFACETS.SIZE}`,
  DIRECTION: `${STACK_PREFIX}_${UIMODIFIERS.DIRECTION}`,
  ORIENTATION: `${STACK_PREFIX}_${UIMODIFIERS.ORIENTATION}`,
  VERTICAL_ALIGNMENT: `${STACK_PREFIX}_${UIMODIFIERS.ALIGN}-vertical`,
  HORIZONTAL_ALIGNMENT: `${STACK_PREFIX}_${UIMODIFIERS.ALIGN}-horizontal`,
  STRETCH: `${STACK_PREFIX}_${UIMODIFIERS.STRETCH}`,
  WRAP: `${STACK_PREFIX}_${UIMODIFIERS.WRAP}`,
  DIVIDER: `${STACK_PREFIX}_${UIMODIFIERS.DIVIDER}`,
  BORDERED: `${STACK_PREFIX}_${UIMODIFIERS.BORDERED}`,
} as const;

describe("Stack", () => {
  describe("classes", () => {
    test("should have props based classes (variant/size)", () => {
      const props: StackProps = {
        variant: "default",
        size: "md",
        direction: "forward",
        orientation: "horizontal",
        alignVertical: "center",
        alignHorizontal: "center",
        stretch: "auto",
        wrap: true,
        rounded: true,
        divider: true,
        bordered: true,
      };

      const wrapper = mount(Stack, { props });

      expect(wrapper.classes()).toContain(
        `${Classes.VARIANT}-${props.variant}`
      );
      expect(wrapper.classes()).toContain(`${Classes.SIZE}-${props.size}`);
      expect(wrapper.classes()).toContain(
        `${Classes.DIRECTION}-${props.direction}`
      );
      expect(wrapper.classes()).toContain(
        `${Classes.ORIENTATION}-${props.orientation}`
      );
      expect(wrapper.classes()).toContain(
        `${Classes.VERTICAL_ALIGNMENT}-${props.alignVertical}`
      );
      expect(wrapper.classes()).toContain(
        `${Classes.HORIZONTAL_ALIGNMENT}-${props.alignHorizontal}`
      );
      expect(wrapper.classes()).toContain(
        `${Classes.STRETCH}-${props.stretch}`
      );
      expect(wrapper.classes()).toContain(`${Classes.WRAP}`);
      expect(wrapper.classes()).toContain(`${Classes.DIVIDER}`);
      expect(wrapper.classes()).toContain(`${Classes.BORDERED}`);
    });
  });

  describe("slots", () => {
    test("should render default slot", () => {
      const slotContent = "Slot Content";
      const slot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mount(Stack, {
        slots: { default: slot },
      });

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Slot Content"`);
    });
  });
});
