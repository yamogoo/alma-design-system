import { mount, type VueWrapper } from "@vue/test-utils";

import { type PasswordInputProps } from "@/components/atoms/inputs/PasswordInput";
import PasswordInput from "@/components/atoms/inputs/PasswordInput.vue";

// const getMaskButton = <T>(wrapper: VueWrapper<T>) => {
//   return wrapper.find('[data-testid="input-mask-button"]');
// };

const getInput = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find('[data-testid="input"]');
};

const REQUIRED_PROPS: PasswordInputProps = {
  value: "",
};

describe("PasswordInput", () => {
  describe("elements", () => {
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
