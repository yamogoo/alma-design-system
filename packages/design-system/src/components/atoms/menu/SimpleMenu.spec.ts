import { mount, VueWrapper } from "@vue/test-utils";

import { getTypedEmittedEvent } from "@/__tests__/utils";

import { UIFACETS } from "@/constants/ui";

import { type ISimpleMenuItem } from "@/components/atoms/menu/menu";
import { SIMPLE_MENU_PREFIX } from "./SimpleMenu";
import SimpleMenu from "@/components/atoms/menu/SimpleMenu.vue";

const Classes = {
  ROOT: SIMPLE_MENU_PREFIX,
  VARIANT: `${SIMPLE_MENU_PREFIX}_${UIFACETS.VARIANT}`,
  SIZE: `${SIMPLE_MENU_PREFIX}_${UIFACETS.SIZE}`,
  MODE: `${SIMPLE_MENU_PREFIX}_${UIFACETS.MODE}`,
  TONE: `${SIMPLE_MENU_PREFIX}_${UIFACETS.TONE}`,
} as const;

const getItems = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.findAll(`[data-testid="${Classes.ROOT}__item"]`);
};

const items: ISimpleMenuItem[] = [
  {
    id: 0,
    label: "First",
    value: "first",
  },
  {
    id: 1,
    label: "Second",
    value: "second",
  },
];

describe("SimpleMenu", () => {
  describe("elements", () => {
    test("should render items from props", () => {
      const wrapper = mount(SimpleMenu, {
        props: {
          selectedItemIndex: 0,
          items,
        },
      });

      const itemEls = getItems(wrapper);
      const itemsLength = itemEls.length;

      expect(itemsLength).toBe(items.length);
      expect(itemsLength).toMatchInlineSnapshot(`2`);
    });

    test("should render Text component", () => {
      const wrapper = mount(SimpleMenu, {
        props: {
          selectedItemIndex: 0,
          items,
        },
      });

      const itemEls = wrapper.findAllComponents({ name: "Text" });
      const itemsLength = itemEls.length;

      expect(itemsLength).toBe(items.length);
      expect(itemsLength).toMatchInlineSnapshot(`2`);

      // Check content (label)
      for (let i = 0; i < itemsLength; i++) {
        const content = itemEls[i].text();
        expect(content).toBe(items[i].label);
      }
    });
  });

  describe("events", () => {
    test("should emit 'select' event", async () => {
      const wrapper = mount(SimpleMenu, {
        props: {
          selectedItemIndex: 0,
          items,
        },
      });

      const itemEls = wrapper.findAllComponents({ name: "Text" });

      await itemEls[0].trigger("pointerdown");
      const emittedEvent = getTypedEmittedEvent(wrapper, "select")[0][0];

      expect(wrapper.emitted()).toHaveProperty("update:selected-item-index");
      expect(wrapper.emitted()).toHaveProperty("select");
      expect(emittedEvent).toMatchInlineSnapshot(`
        {
          "id": 0,
          "label": "First",
          "value": "first",
        }
      `);

      await itemEls[1].trigger("pointerdown");
      const emittedEvent2 = getTypedEmittedEvent(wrapper, "select")[1][0];

      expect(wrapper.emitted()).toHaveProperty("update:selected-item-index");
      expect(wrapper.emitted()).toHaveProperty("select");
      expect(emittedEvent2).toMatchInlineSnapshot(`
        {
          "id": 1,
          "label": "Second",
          "value": "second",
        }
      `);
    });
  });
});
