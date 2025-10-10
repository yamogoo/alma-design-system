import { mount, VueWrapper } from "@vue/test-utils";

import { UIFACETS, UIMODIFIERS } from "@/constants/ui";

import { GROUP_PREFIX, type GroupProps } from "./Group";
import Group from "./Group.vue";

const getSurface = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.findComponent({ name: "Surface" });
};

const Classes = {
  ROOT_CLASS: GROUP_PREFIX,
  VARIANT: `${GROUP_PREFIX}_${UIFACETS.VARIANT}`,
  SIZE: `${GROUP_PREFIX}_${UIFACETS.SIZE}`,
  DIRECTION: `${GROUP_PREFIX}_${UIMODIFIERS.DIRECTION}`,
  ORIENTATION: `${GROUP_PREFIX}_${UIMODIFIERS.ORIENTATION}`,
  VERTICAL_ALIGNMENT: `${GROUP_PREFIX}_${UIMODIFIERS.ALIGN}-vertical`,
  HORIZONTAL_ALIGNMENT: `${GROUP_PREFIX}_${UIMODIFIERS.ALIGN}-horizontal`,
  STRETCH: `${GROUP_PREFIX}_${UIMODIFIERS.STRETCH}`,
  WRAP: `${GROUP_PREFIX}_${UIMODIFIERS.WRAP}`,
  DIVIDER: `${GROUP_PREFIX}_${UIMODIFIERS.DIVIDER}`,
} as const;

describe("Group", () => {
  describe("elements", () => {
    test("should render Surface", () => {
      const wrapper = mount(Group);

      const surface = getSurface(wrapper);
      const isSurfaceExists = surface.exists();

      expect(isSurfaceExists).toBeTruthy();
    });
  });

  describe("classes", () => {
    test("should have props based classes (variant/size)", () => {
      const props: GroupProps = {
        variant: "default",
        size: "md",
        mode: "neutral",
        direction: "forward",
        orientation: "horizontal",
        verticalAlignment: "center",
        horizontalAlignment: "center",
        stretch: "auto",
        wrap: true,
        divider: true,
      };

      const wrapper = mount(Group, { props });

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
        `${Classes.VERTICAL_ALIGNMENT}-${props.verticalAlignment}`
      );
      expect(wrapper.classes()).toContain(
        `${Classes.HORIZONTAL_ALIGNMENT}-${props.horizontalAlignment}`
      );
      expect(wrapper.classes()).toContain(
        `${Classes.STRETCH}-${props.stretch}`
      );
      expect(wrapper.classes()).toContain(`${Classes.WRAP}`);
      expect(wrapper.classes()).toContain(`${Classes.DIVIDER}`);
    });
  });

  describe("slots", () => {
    test("should render default slot", () => {
      const slotContent = "Slot Content";
      const slot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mount(Group, {
        slots: { default: slot },
      });

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Slot Content"`);
    });
  });
});
