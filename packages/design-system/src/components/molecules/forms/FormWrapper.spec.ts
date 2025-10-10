import { mount, VueWrapper } from "@vue/test-utils";

import { SURFACE_PREFIX } from "@/components/atoms/containers/Surface";

import { type FormWrapperProps } from "@/components/molecules/forms/FormWrapper";
import FormWrapper from "@/components/molecules/forms/FormWrapper.vue";

const Classes = {
  ROOT_CLASS: "form-wrapper",
  BASE_CLASS_NAME: SURFACE_PREFIX,
  VARIANT: `${SURFACE_PREFIX}_variant`,
  SIZE: `${SURFACE_PREFIX}_size`,
};

const getSurface = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.findComponent({ name: "Surface" });
};

describe("FormWrapper", () => {
  describe("elements", () => {
    test("should render Surface componnt", () => {
      const wrapper = mount(FormWrapper);

      const surface = getSurface(wrapper);
      const isSurfaceExists = surface.exists();

      expect(isSurfaceExists).toBeTruthy();
    });
  });

  describe("classes", () => {
    test("renders with default class", async () => {
      const props: FormWrapperProps = {
        variant: "default",
        size: "lg",
        mode: "accent",
        tone: "canvas",
        borderSides: "r",
      };

      const wrapper = mount(FormWrapper, {
        props,
      });

      expect(
        wrapper.classes(`${Classes.VARIANT}-${props.variant}`)
      ).toBeTruthy();
      expect(wrapper.classes(`${Classes.SIZE}-${props.size}`)).toBeTruthy();

      await wrapper.setProps({ bordered: true });

      expect(
        wrapper.classes(`${Classes.BASE_CLASS_NAME}_border-r`)
      ).toBeTruthy();
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
