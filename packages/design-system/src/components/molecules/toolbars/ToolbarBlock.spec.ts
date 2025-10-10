import { mount, VueWrapper } from "@vue/test-utils";

import { UIFACETS } from "@/constants/ui";

import { TOOLBAR_GROUP_PREFIX, type ToolbarGroupProps } from "./ToolbarGroup";
import ToolbarGroup from "./ToolbarGroup.vue";

const Classes = {
  ROOT_CLASS: TOOLBAR_GROUP_PREFIX,
  VARIANT: `${TOOLBAR_GROUP_PREFIX}_${UIFACETS.VARIANT}`,
  SIZE: `${TOOLBAR_GROUP_PREFIX}_${UIFACETS.SIZE}`,
} as const;

const getGroup = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.findComponent({ name: "Group" });
};

describe("ToolbarBlock", () => {
  describe("elements", () => {
    test("should render Group component", () => {
      const wrapper = mount(ToolbarGroup);

      const component = getGroup(wrapper);
      const isComponentExists = component.exists();

      expect(isComponentExists).toBeTruthy();
      expect(isComponentExists).toMatchInlineSnapshot(`true`);
    });
  });

  describe("classes", () => {
    test("should have props based classes (variant/size)", () => {
      const props: ToolbarGroupProps = {
        variant: "default",
        size: "md",
      };

      const wrapper = mount(ToolbarGroup, { props });

      expect(wrapper.classes()).toContain(
        `${Classes.VARIANT}-${props.variant}`
      );
      expect(wrapper.classes()).toContain(`${Classes.SIZE}-${props.size}`);
    });
  });

  describe("slots", () => {
    test("should render default slot", () => {
      const slotContent = "Slot Content";
      const slot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mount(ToolbarGroup, {
        slots: { default: slot },
      });

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Slot Content"`);
    });
  });
});
