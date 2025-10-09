import { mount, VueWrapper } from "@vue/test-utils";

import type { ToolbarGroupProps } from "./ToolbarGroup";
import ToolbarGroup from "./ToolbarGroup.vue";

enum Classes {
  ROOT_CLASS = "toolbar-group",
  VARIANT = `${Classes.ROOT_CLASS}_variant`,
  SIZE = `${Classes.ROOT_CLASS}_size`,
}

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
