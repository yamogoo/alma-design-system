import { mount, VueWrapper } from "@vue/test-utils";

import { getText } from "@/utils";

import LogoWithDescriptor from "./LogoWithDescriptor.vue";
import type { LogoWithDescriptorProps } from "./logoWithDescriptor";

enum Classes {
  ROOT_CLASS = "logo-with-descriptor",
  VARIANT = `${Classes.ROOT_CLASS}_variant`,
  SIZE = `${Classes.ROOT_CLASS}_size`,
  MODE = `${Classes.ROOT_CLASS}_mode`,
  TONE = `${Classes.ROOT_CLASS}_tone`,
}

const getLogoByTestId = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find("[data-testid='logo']");
};

describe("LogoWithDescriptor", () => {
  describe("classes", () => {
    test("should have props based classes (variant/size)", async () => {
      const props: LogoWithDescriptorProps = {
        variant: "default",
        size: "md",
        tone: "default",
        mode: "primary",
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
    test("should render Logo component", async () => {
      const wrapper = mount(LogoWithDescriptor);

      const logoComponent = getLogoByTestId(wrapper);
      const isLogoComponentExists = logoComponent.exists();

      expect(isLogoComponentExists).toBeTruthy();
      expect(isLogoComponentExists).toMatchInlineSnapshot(`true`);
    });

    test("should render Text component", async () => {
      const wrapper = mount(LogoWithDescriptor);

      const textComponent = getText(wrapper);
      const isTextComponentExists = textComponent.exists();

      expect(isTextComponentExists).toBeTruthy();
      expect(isTextComponentExists).toMatchInlineSnapshot(`true`);
    });
  });
});
