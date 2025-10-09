import { mount, type VueWrapper } from "@vue/test-utils";

import { PREFIX } from "@/components/atoms/inputs/Input";

import { type TextInputProps } from "./TextInput";
import TextInput from "./TextInput.vue";

const getInput = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`[data-testid="${PREFIX}"]`);
};

const REQUIRED_PROPS: TextInputProps = {
  value: "",
};

describe("PasswordInput", () => {
  describe("elements", () => {
    test("should render Input component", () => {
      const wrapper = mount(TextInput, {
        props: REQUIRED_PROPS,
      });

      const input = getInput(wrapper);
      const isInputExists = input.exists();

      expect(isInputExists).toBeTruthy();
    });
  });
});
