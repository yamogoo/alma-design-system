import { mount } from "@vue/test-utils";

import { ControlWrapper, type ControlWrapperProps } from "@/components/atoms";

enum Classes {
  ROOT_CLASS = "control-wrapper",
  VARIANT = `${Classes.ROOT_CLASS}_variant`,
  SIZE = `${Classes.ROOT_CLASS}_size`,
}

describe("ControlWrapper", () => {
  describe("classes", () => {
    test("should have props based classes (variant/size)", async () => {
      const props: ControlWrapperProps = {
        size: "md",
        variant: "default",
      };

      const wrapper = mount(ControlWrapper, { props });

      expect(wrapper.classes()).toContain(
        `${Classes.VARIANT}-${props.variant}`
      );
      expect(wrapper.classes()).toContain(`${Classes.SIZE}-${props.size}`);
    });
  });

  describe("slots", () => {
    test("should render default slot", async () => {
      const slotContent = "Slot Content";
      const slot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mount(ControlWrapper, {
        slots: { default: slot },
      });

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Slot Content"`);
    });
  });
});
