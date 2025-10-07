import { mount, VueWrapper } from "@vue/test-utils";

import { type DropdownProps } from "@/components/molecules/dropdown/Dropdown";
import Dropdown from "@/components/molecules/dropdown/Dropdown.vue";

const REQUIRED_PROPS: DropdownProps = {
  value: "some value",
};

const getValue = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`[data-testid="dropdown-value"]`);
};

const getOptions = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`.dropdown__options`);
};

const getValueLabel = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(".dropdown__current-value-label");
};

const getValuePostfix = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(".dropdown__current-value-postfix");
};

describe("Dropdown", () => {
  describe("elements", () => {
    const wrapper = mount(Dropdown, {
      props: { ...REQUIRED_PROPS },
    });

    test("should render value dom element", async () => {
      const expectedValue = "Some Value";

      await wrapper.setProps({ value: expectedValue });

      const value = getValueLabel(wrapper);

      expect(value.exists()).toBeTruthy();

      const valueLabel = value.text();

      expect(valueLabel).toBe(expectedValue);
      expect(valueLabel).toMatchInlineSnapshot(`"Some Value"`);
    });

    test("should render value postfix dom element", async () => {
      const expectedPostfixValue = "Some Postfix";

      await wrapper.setProps({ valuePostfix: expectedPostfixValue });

      const postfix = getValuePostfix(wrapper);

      expect(postfix.exists()).toBeTruthy();

      const postfixValue = postfix.text();

      expect(postfixValue).toBe(expectedPostfixValue);
      expect(postfixValue).toMatchInlineSnapshot(`"Some Postfix"`);
    });
  });
  describe("slots", () => {
    test("should render default slot (options) when clicked by value", async () => {
      const slotContent = "Slot Content";
      const slot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mount(Dropdown, {
        props: {
          ...REQUIRED_PROPS,
        },
        slots: { default: slot },
      });

      const value = getValue(wrapper);
      await value.trigger("click");

      const isOptionsExists = getOptions(wrapper).exists();

      expect(isOptionsExists).toBeTruthy();

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const isSlotElExists = slotEl.exists();

      expect(isSlotElExists).toBeTruthy();

      const text = slotEl.text();

      expect(slotEl.exists()).toBeTruthy();
      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Slot Content"`);
    });
  });
});
