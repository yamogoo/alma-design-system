import { mount } from "@vue/test-utils";

import { getTypedEmittedEvent } from "@/__tests__/utils";

import { type MenuItems } from "@/components/atoms/menu/menu";
import SimpleMenu from "@/components/atoms/menu/SimpleMenu.vue";

const items: MenuItems = [
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
          selectedItemId: 0,
          items,
        },
      });

      const itemEls = wrapper.findAll('[data-testid="simple-menu-item"]');
      const itemsLength = itemEls.length;

      expect(itemsLength).toBe(items.length);
      expect(itemsLength).toMatchInlineSnapshot(`2`);
    });

    test("should render Text component", () => {
      const wrapper = mount(SimpleMenu, {
        props: {
          selectedItemId: 0,
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
          selectedItemId: 0,
          items,
        },
      });

      const itemEls = wrapper.findAllComponents({ name: "Text" });

      await itemEls[0].trigger("pointerdown");
      const emittedEvent = getTypedEmittedEvent(wrapper, "select")[0][0];

      expect(wrapper.emitted()).toHaveProperty("update:selected-item-id");
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

      expect(wrapper.emitted()).toHaveProperty("update:selected-item-id");
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
