import { mount, VueWrapper } from "@vue/test-utils";

import { getText } from "@/__tests__/utils";

import {
  LOGO_WITH_DESCRIPTOR_PREFIX,
  type LogoWithDescriptorProps,
} from "@/components/atoms/logos/LogoWithDescriptor";
import LogoWithDescriptor from "@/components/atoms/logos/LogoWithDescriptor.vue";

const Classes = {
  ROOT_CLASS: LOGO_WITH_DESCRIPTOR_PREFIX,
  VARIANT: `${LOGO_WITH_DESCRIPTOR_PREFIX}_variant`,
  SIZE: `${LOGO_WITH_DESCRIPTOR_PREFIX}_size`,
  MODE: `${LOGO_WITH_DESCRIPTOR_PREFIX}_mode`,
  TONE: `${LOGO_WITH_DESCRIPTOR_PREFIX}_tone`,
} as const;

const getLogoByTestId = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find("[data-testid='logo']");
};

describe("LogoWithDescriptor", () => {
  describe("classes", () => {
    test("should have props based classes (variant/size)", () => {
      const props: LogoWithDescriptorProps = {
        variant: "default",
        size: "md",
        mode: "neutral",
        tone: "primary",
      };

      const wrapper = mount(LogoWithDescriptor, { props });

      expect(wrapper.classes()).toContain(
        `${Classes.VARIANT}-${props.variant}`
      );
      expect(wrapper.classes()).toContain(`${Classes.SIZE}-${props.size}`);
      expect(wrapper.classes()).toContain(`${Classes.TONE}-${props.tone}`);
      expect(wrapper.classes()).toContain(`${Classes.MODE}-${props.mode}`);
    });
  });

  describe("elements", () => {
    test("should render Logo component", () => {
      const wrapper = mount(LogoWithDescriptor);

      const logoComponent = getLogoByTestId(wrapper);
      const isLogoComponentExists = logoComponent.exists();

      expect(isLogoComponentExists).toBeTruthy();
      expect(isLogoComponentExists).toMatchInlineSnapshot(`true`);
    });

    test("should render Text component", () => {
      const wrapper = mount(LogoWithDescriptor);

      const textComponent = getText(wrapper);
      const isTextComponentExists = textComponent.exists();

      expect(isTextComponentExists).toBeTruthy();
      expect(isTextComponentExists).toMatchInlineSnapshot(`true`);
    });
  });
});
