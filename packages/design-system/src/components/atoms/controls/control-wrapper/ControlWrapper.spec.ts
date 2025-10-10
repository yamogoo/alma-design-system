import { mount } from "@vue/test-utils";

import {
  CONTROL_WRAPPER_PREFIX,
  type ControlWrapperProps,
} from "@/components/atoms/controls/control-wrapper/ControlWrapper";
import ControlWrapper from "@/components/atoms/controls/control-wrapper/ControlWrapper.vue";

const Classes = {
  ROOT_CLASS: CONTROL_WRAPPER_PREFIX,
  VARIANT: `${CONTROL_WRAPPER_PREFIX}_variant`,
  SIZE: `${CONTROL_WRAPPER_PREFIX}_size`,
};

describe("ControlWrapper", () => {
  describe("classes", () => {
    test("should have props based classes (variant/size)", () => {
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
    test("should render default slot", () => {
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
