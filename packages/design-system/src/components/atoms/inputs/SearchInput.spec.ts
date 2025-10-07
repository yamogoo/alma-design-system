import { type DOMWrapper, mount, VueWrapper } from "@vue/test-utils";
import { describe, test, expect } from "vitest";

import { type SearchFieldProps } from "@/components/atoms/inputs/SearchInput";
import SearchInput from "@/components/atoms/inputs/SearchInput.vue";

const getInput = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find('[data-testid="input"]');
};

const REQUIRED_PROPS: SearchFieldProps = {
  value: "",
};

const changeInputValue = async (
  input: DOMWrapper<HTMLInputElement>,
  value: string
): Promise<void> => {
  input.element.value = value;
  await input.trigger("input");
};

describe("SearchInput", () => {
  describe("elements", () => {
    test("should render Input component", () => {
      const wrapper = mount(SearchInput, {
        props: REQUIRED_PROPS,
      });

      const input = getInput(wrapper);
      const isInputExists = input.exists();

      expect(isInputExists).toBeTruthy();
    });

    describe("reset button", () => {
      const searchedValue = "Searched Value";
      const wrapper = mount(SearchInput);

      test("should render reset button", async () => {
        const input = wrapper.find("input");

        await changeInputValue(input, searchedValue);

        const resetButton = wrapper.findComponent({ name: "ControlButton" });
        const isResetButtonExists = resetButton.exists();

        expect(isResetButtonExists).toBeTruthy();
        expect(isResetButtonExists).toMatchInlineSnapshot(`true`);
      });
    });
  });
});
