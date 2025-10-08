import { mount, VueWrapper } from "@vue/test-utils";

import type { ListItems, ListProps } from "./List";
import List from "./List.vue";

enum Classes {
  ROOT_CLASS = "group",
  VARIANT = `${Classes.ROOT_CLASS}_variant`,
  SIZE = `${Classes.ROOT_CLASS}_size`,
  MODE = `${Classes.ROOT_CLASS}_mode`,
  DIRECTION = `${Classes.ROOT_CLASS}_direction`,
  ORIENTATION = `${Classes.ROOT_CLASS}_orientation`,
  VERTICAL_ALIGNMENT = `${Classes.ROOT_CLASS}_align-vertical`,
  HORIZONTAL_ALIGNMENT = `${Classes.ROOT_CLASS}_align-horizontal`,
  STRETCH = `${Classes.ROOT_CLASS}_stretch`,
  WRAP = `${Classes.ROOT_CLASS}_wrap`,
  DIVIDER = `${Classes.ROOT_CLASS}_divider`,
}

const getGroup = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find('[data-testid="group"]');
};

const getGroupComponent = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.findComponent({ name: "Group" });
};

const getItem = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.findAllComponents({ name: "ListItem" });
};

const getItems = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.findAllComponents({ name: "ListItem" });
};

const ITEMS: ListItems = [
  {
    id: String(crypto.randomUUID()),
    title: "First",
    description: "Some description",
  },
  {
    id: String(crypto.randomUUID()),
    title: "Second",
    description: "Some description",
  },
  {
    id: String(crypto.randomUUID()),
    title: "Third",
    description: "Some description",
  },
];

describe("List", () => {
  describe("elements", () => {
    test("should have props based classes (variant/size)/...", () => {
      const props: ListProps = {
        variant: "content",
        size: "md",
        mode: "neutral",
        direction: "forward",
        orientation: "horizontal",
        verticalAlignment: "center",
        horizontalAlignment: "center",
        stretch: "auto",
        wrap: true,
        divider: true,
      };

      const wrapper = mount(List, { props });

      const group = getGroup(wrapper);

      expect(group.classes()).toContain(`${Classes.VARIANT}-${props.variant}`);
      expect(group.classes()).toContain(`${Classes.SIZE}-${props.size}`);
      expect(group.classes()).toContain(
        `${Classes.DIRECTION}-${props.direction}`
      );
      expect(group.classes()).toContain(
        `${Classes.ORIENTATION}-${props.orientation}`
      );
      expect(group.classes()).toContain(
        `${Classes.VERTICAL_ALIGNMENT}-${props.verticalAlignment}`
      );
      expect(group.classes()).toContain(
        `${Classes.HORIZONTAL_ALIGNMENT}-${props.horizontalAlignment}`
      );
      expect(group.classes()).toContain(`${Classes.STRETCH}-${props.stretch}`);
    });

    test("should render Group", () => {
      const wrapper = mount(List);

      const group = getGroupComponent(wrapper);
      const isGroupExists = group.exists();

      expect(isGroupExists).toBeTruthy();
    });

    test("should render ListItems by default through props.items", () => {
      const expectedItems = ITEMS;

      const wrapper = mount(List, {
        props: {
          items: expectedItems,
        },
      });

      const items = getItem(wrapper);
      const itemsLength = items.length;

      expect(itemsLength).toBe(expectedItems.length);
    });
  });

  describe("slots", () => {
    test("should render default (Item) slot", () => {
      const slotContent = "Slot Content";
      const slot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mount(List, {
        slots: { default: slot },
      });

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Slot Content"`);
    });

    test("string items normalize to IListItem", () => {
      const wrapper = mount(List, {
        props: { items: ["Foo", "Bar", "Baz"] },
      });
      const items = wrapper.findAllComponents({ name: "ListItem" });
      expect(items.length).toBe(3);

      expect(items[0].text()).toContain("Foo");
      expect(items[1].text()).toContain("Bar");
      expect(items[2].text()).toContain("Baz");
    });
  });

  describe("selection & behavior", () => {
    const ITEMS = [
      { id: "a", title: "A" },
      { id: "b", title: "B" },
      { id: "c", title: "C" },
    ];

    test("isSelectable=false: role=list, items role=listitem; click does not change selection", async () => {
      const wrapper = mount(List, {
        props: { items: ITEMS, isSelectable: false },
      });

      const group = getGroup(wrapper);
      expect(group.attributes("role")).toBe("list");

      const items = getItems(wrapper);

      await items[0].trigger("click");
      expect(wrapper.emitted("update:selectedItemIndexes")).toBeUndefined();
    });
  });

  describe("keyboard", () => {
    const ITEMS = [
      { id: "a", title: "A" },
      { id: "b", title: "B" },
      { id: "c", title: "C" },
    ];

    test("ArrowDown/Up moves focus index (reflected via isFocused prop)", async () => {
      const wrapper = mount(List, { props: { items: ITEMS } });
      const group = getGroup(wrapper);

      // initial i=0
      let items = getItems(wrapper);
      expect(items[0].props("isFocused")).toBe(true);

      await group.trigger("keydown", { key: "ArrowDown" });
      items = getItems(wrapper);
      expect(items[1].props("isFocused")).toBe(true);

      await group.trigger("keydown", { key: "ArrowUp" });
      items = getItems(wrapper);
      expect(items[0].props("isFocused")).toBe(true);
    });

    test("Home/End jump to first/last; Enter/Space selects focused", async () => {
      const wrapper = mount(List, { props: { items: ITEMS } });
      const group = getGroup(wrapper);

      await group.trigger("keydown", { key: "End" });
      let items = getItems(wrapper);
      expect(items[2].props("isFocused")).toBe(true);

      await group.trigger("keydown", { key: "Enter" });
      const upd0 = wrapper.emitted("update:selectedItemIndexes")?.[0]?.[0];
      expect(upd0).toBe("c");

      await group.trigger("keydown", { key: "Home" });
      items = getItems(wrapper);
      expect(items[0].props("isFocused")).toBe(true);

      await group.trigger("keydown", { key: " " });
      const upd1 = wrapper.emitted("update:selectedItemIndexes")?.[1]?.[0];
      expect(upd1).toBe("a");
    });
  });
});
