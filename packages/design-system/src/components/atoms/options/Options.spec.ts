import { mount, VueWrapper } from "@vue/test-utils";
import { getTypedEmittedEvent } from "@/__tests__/utils";

import type { OptionsItems, OptionsProps } from "./Options";

import Options from "./Options.vue";

const CLASS_NAME = "options";

const items: OptionsItems<string> = ["First", "Second", "Third"];

const getOptions = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.findAll('[data-testid="options__option"]');
};

describe("Options", () => {
  describe("classes", () => {
    test("renders with default class", () => {
      const props: OptionsProps<string> = {
        items,
        value: items[0],
        variant: "default",
        size: "lg",
        mode: "neutral",
        tone: "primary",
      };

      const wrapper = mount(Options, {
        props,
      });

      expect(
        wrapper.classes(`${CLASS_NAME}_variant-${props.variant}`)
      ).toBeTruthy();
      expect(wrapper.classes(`${CLASS_NAME}_size-${props.size}`)).toBeTruthy();
      expect(wrapper.classes(`${CLASS_NAME}_mode-${props.mode}`)).toBeTruthy();
      expect(wrapper.classes(`${CLASS_NAME}_tone-${props.tone}`)).toBeTruthy();
    });
  });

  describe("elements", () => {
    test("should render optons", () => {
      const wrapper = mount(Options, {
        props: {
          value: items[0],
          items: items,
          isCurrentOptionShown: true,
        },
      });

      const options = getOptions(wrapper);
      const optionsCount = options.length;

      expect(optionsCount).toBe(items.length);
      expect(optionsCount).toMatchInlineSnapshot(`3`);
    });

    test("should not render current option in optons list", () => {
      const wrapper = mount(Options, {
        props: {
          value: items[0],
          items: items,
          isCurrentOptionShown: false,
        },
      });

      const options = getOptions(wrapper);
      const optionsCount = options.length;

      expect(optionsCount).toBe(items.length - 1);
      expect(optionsCount).toMatchInlineSnapshot(`2`);
    });
  });

  describe("values", () => {
    test("should render option value", () => {
      const wrapper = mount(Options, {
        props: {
          value: items[0],
          items: items,
          isCurrentOptionShown: true,
        },
      });

      const options = getOptions(wrapper);
      const optionValue = options[0].text();

      expect(optionValue).toBe(items[0]);
      expect(optionValue).toMatchInlineSnapshot(`"First"`);
    });
  });

  describe("slots", () => {
    test("should render option value slot", () => {
      const expectedSlotValue = "Some Slot";
      const expectedSlot = `<p data-testid="slot">${expectedSlotValue}</p>`;

      const wrapper = mount(Options, {
        props: {
          value: items[0],
          items: items,
          isCurrentOptionShown: true,
        },
        slots: {
          default: expectedSlot,
        },
      });

      const slots = wrapper.findAll('[data-testid="slot"]');
      const slotValue = slots[0].text();

      expect(slotValue).toBe(expectedSlotValue);
      expect(slotValue).toMatchInlineSnapshot(`"Some Slot"`);
    });
  });

  describe("events", () => {
    test("should emit select event", async () => {
      const wrapper = mount(Options, {
        props: {
          value: items[0],
          items: items,
          isCurrentOptionShown: true,
        },
      });

      const options = getOptions(wrapper);

      await options[0].trigger("click");

      const eventValue = getTypedEmittedEvent(wrapper, "select")[0][0];

      expect(eventValue).toBe(items[0]);
      expect(eventValue).toMatchInlineSnapshot(`"First"`);
    });
  });
});
