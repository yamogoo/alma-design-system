import { mount, type VueWrapper } from "@vue/test-utils";

import { PREFIX } from "@/components/atoms/inputs/Input";

import { type PasswordInputProps } from "./PasswordInput";
import PasswordInput from "./PasswordInput.vue";

// const getMaskButton = <T>(wrapper: VueWrapper<T>) => {
//   return wrapper.find(`[data-testid="${PREFIX}-mask-button"]`);
// };

const getInput = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`[data-testid="${PREFIX}"]`);
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
