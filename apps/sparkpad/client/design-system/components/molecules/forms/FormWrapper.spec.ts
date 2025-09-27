import { mount } from "@vue/test-utils";

import { FormWrapper, type FormWrapperProps } from "@/components/molecules";

const CLASS_NAME = "form-wrapper";

describe("FormWrapper", () => {
  describe("classes", () => {
    test("renders with default class", async () => {
      const props: FormWrapperProps = {
        variant: "default",
        size: "lg",
        mode: "neutral",
        tone: "primary",
      };

      const wrapper = mount(FormWrapper, {
        props,
      });

      expect(
        wrapper.classes(`${CLASS_NAME}_variant-${props.variant}`)
      ).toBeTruthy();
      expect(wrapper.classes(`${CLASS_NAME}_mode-${props.mode}`)).toBeTruthy();
      expect(wrapper.classes(`${CLASS_NAME}_size-${props.size}`)).toBeTruthy();

      await wrapper.setProps({ bordered: true });

      expect(wrapper.classes(`${CLASS_NAME}_bordered`)).toBeTruthy();
    });
  });

  describe("slots", () => {
    test("renders default slot", () => {
      const wrapper = mount(FormWrapper, {
        slots: { default: "<div class='default-slot'>Slot Content</div>" },
      });

      expect(wrapper.find(".default-slot").exists()).toBeTruthy();
    });
  });
});
