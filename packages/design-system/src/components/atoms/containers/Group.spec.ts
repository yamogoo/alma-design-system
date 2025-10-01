import { mount } from "@vue/test-utils";

import type { GroupProps } from "./Group";
import Group from "./Group.vue";

enum Classes {
  ROOT_CLASS = "group",
  VARIANT = `${Classes.ROOT_CLASS}_variant`,
  SIZE = `${Classes.ROOT_CLASS}_size`,
  MODE = `${Classes.ROOT_CLASS}_mode`,
  DIRECTION = `${Classes.ROOT_CLASS}_direction`,
  ORIENTATION = `${Classes.ROOT_CLASS}_orientation`,
  VERTICAL_ALIGNMENT = `${Classes.ROOT_CLASS}_align-vertical`,
  HORIZONTAL_ALIGNMENT = `${Classes.ROOT_CLASS}_align-horizontal`,
  STRETCH = `${Classes.ROOT_CLASS}_stretch`,
  WRAP = `${Classes.ROOT_CLASS}_wrap`,
  DIVIDER = `${Classes.ROOT_CLASS}_divider`,
}

describe("Group", () => {
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
      expect(wrapper.classes()).toContain(`${Classes.MODE}-${props.mode}`);
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
