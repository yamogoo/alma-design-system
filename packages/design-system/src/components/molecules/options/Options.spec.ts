import { mount, VueWrapper } from "@vue/test-utils";
import { getTypedEmittedEvent } from "@/__tests__/utils";

import {
  OPTIONS_PREFIX,
  type OptionsItems,
  type OptionsProps,
} from "./Options";

import { UIFACETS } from "@/constants/ui";
import Options from "./Options.vue";

const Classes = {
  ROOT_CLASS: OPTIONS_PREFIX,
  VARIANT: `${OPTIONS_PREFIX}_${UIFACETS.VARIANT}`,
  SIZE: `${OPTIONS_PREFIX}_${UIFACETS.SIZE}`,
  MODE: `${OPTIONS_PREFIX}_${UIFACETS.MODE}`,
  TONE: `${OPTIONS_PREFIX}_${UIFACETS.TONE}`,
} as const;

const items: OptionsItems<string> = ["First", "Second", "Third"];

const getOptions = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.findAll(`[data-testid="${Classes.ROOT_CLASS}__option"]`);
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
        wrapper.classes(`${Classes.VARIANT}-${props.variant}`)
      ).toBeTruthy();
      expect(wrapper.classes(`${Classes.SIZE}-${props.size}`)).toBeTruthy();
      expect(wrapper.classes(`${Classes.MODE}-${props.mode}`)).toBeTruthy();
      expect(wrapper.classes(`${Classes.TONE}-${props.tone}`)).toBeTruthy();
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
