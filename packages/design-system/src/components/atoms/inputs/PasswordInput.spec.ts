import { mount, type VueWrapper } from "@vue/test-utils";

import { PasswordInput, type PasswordInputProps } from "@/components/atoms";

const getMaskButton = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find('[data-testid="input-mask-button"]');
};

const getInput = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find('[data-testid="input"]');
};

const REQUIRED_PROPS: PasswordInputProps = {
  value: "",
};

describe("PasswordInput", () => {
  describe("elements", () => {
    test("should render mask-button", () => {
      const wrapper = mount(PasswordInput, {
        props: REQUIRED_PROPS,
      });

      const button = getMaskButton(wrapper);
      const isButtonExists = button.exists();

      expect(isButtonExists).toBeTruthy();
    });

    test("should render Input component", () => {
      const wrapper = mount(PasswordInput, {
        props: REQUIRED_PROPS,
      });

      const input = getInput(wrapper);
      const isInputExists = input.exists();

      expect(isInputExists).toBeTruthy();
    });
  });
});
