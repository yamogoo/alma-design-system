import { mount, VueWrapper } from "@vue/test-utils";

import { UIFACETS, UISTATES } from "@/constants/ui";

import {
  TREE_VIEW_ITEM_PREFIX,
  type TreeViewItemProps,
  type TreeViewNode,
} from "./TreeViewItem";

import TreeViewItem from "./TreeViewItem.vue";

const Classes = {
  ROOT_CLASS: TREE_VIEW_ITEM_PREFIX,
  STATE: `${TREE_VIEW_ITEM_PREFIX}_${UIFACETS.STATE}`,
} as const;

const getCaret = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`.${Classes.ROOT_CLASS}__caret`);
};

const getLabel = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`.${Classes.ROOT_CLASS}__label`);
};

const getGroup = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`[data-testid="${Classes.ROOT_CLASS}_type-group"]`);
};

const getRoot = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`.${Classes.ROOT_CLASS}`);
};

const REQUIRED_PROPS: TreeViewItemProps = {
  node: {
    id: "1",
    name: "First",
  },
  depth: 0,
  selectedItemIndexes: null,
  expandedItemIndexes: null,
  loadingItemIndexes: null,
};

const node: TreeViewNode = {
  id: "1",
  name: "Second",
  isLeaf: false,
  children: [
    {
      id: "2",
      name: "Second",
    },
  ],
};

describe("TreeViewItem", () => {
  vi.mock("@/composables/local/actions/useHover", () => ({
    useHover: () => ({ isHovered: { value: true } }),
  }));

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  describe("elements", () => {
    test("should render caret Icon", () => {
      const wrapper = mount(TreeViewItem, {
        props: REQUIRED_PROPS,
      });

      const icon = getCaret(wrapper);
      const isIconExists = icon.exists();

      expect(isIconExists).toBeTruthy();
    });

    test("should render label", () => {
      const wrapper = mount(TreeViewItem, {
        props: REQUIRED_PROPS,
      });

      const label = getLabel(wrapper);
      const isLabelExists = label.exists();

      expect(isLabelExists).toBeTruthy();
    });

    test("should render group", () => {
      const wrapper = mount(TreeViewItem, {
        props: {
          ...REQUIRED_PROPS,
          expandedItemIndexes: [node.id],
          node,
        },
      });

      const group = getGroup(wrapper);
      const isGroupExists = group.exists();

      expect(isGroupExists).toBeTruthy();
    });

    test("leaf: no caret and no aria-expanded", () => {
      const wrapper = mount(TreeViewItem, {
        props: {
          ...REQUIRED_PROPS,
          node: { id: "10", name: "Leaf", isLeaf: true },
        },
      });
      expect(getCaret(wrapper).exists()).toBe(false);
      expect(getRoot(wrapper).attributes("aria-expanded")).toBeUndefined();
    });
  });

  describe("props", () => {
    test("should expand items", async () => {
      const wrapper = mount(TreeViewItem, {
        props: {
          ...REQUIRED_PROPS,
          expandedItemIndexes: [],
          node,
        },
      });

      await wrapper.setProps({
        expandedItemIndexes: [node.id],
      });

      const group = getGroup(wrapper);
      const isGroupExists = group.exists();

      expect(isGroupExists).toBeTruthy();
    });

    test("selected single value works", () => {
      const wrapper = mount(TreeViewItem, {
        props: { ...REQUIRED_PROPS, selectedItemIndexes: "1" },
      });
      expect(getRoot(wrapper).classes()).toContain(
        `${Classes.STATE}-${UISTATES.SELECTED}`
      );
    });

    test("expanded single value works", () => {
      const wrapper = mount(TreeViewItem, {
        props: {
          ...REQUIRED_PROPS,
          expandedItemIndexes: node.id,
          node: { ...node },
        },
      });
      expect(getGroup(wrapper).exists()).toBe(true);
    });

    test("renders child with incremented depth and inherited props", () => {
      const wrapper = mount(TreeViewItem, {
        props: {
          ...REQUIRED_PROPS,
          node,
          depth: 1,
          expandedItemIndexes: [node.id, "2"],
          selectedItemIndexes: ["2"],
        },
      });

      const child = wrapper.find('[data-node-id="2"]');
      expect(child.exists()).toBe(true);
      expect(child.attributes("aria-level")).toBe("2");
      expect(child.classes()).toContain(
        `${Classes.STATE}-${UISTATES.SELECTED}`
      );
    });
  });

  describe("classes/attributes", () => {
    test("hovered class applied when hovered", () => {
      const wrapper = mount(TreeViewItem, { props: REQUIRED_PROPS });
      expect(getRoot(wrapper).classes()).toContain(
        `${Classes.STATE}-${UISTATES.HOVERED}`
      );
    });

    test("hovered class applied when hovered", () => {
      const wrapper = mount(TreeViewItem, { props: REQUIRED_PROPS });
      expect(getRoot(wrapper).classes()).toContain(
        `${Classes.STATE}-${UISTATES.HOVERED}`
      );
    });

    test("should select items via props", async () => {
      const wrapper = mount(TreeViewItem, {
        props: {
          ...REQUIRED_PROPS,
          expandedItemIndexes: [],
          node,
          isSelectOnRelease: true,
        },
      });

      const root = getRoot(wrapper);

      await wrapper.setProps({ selectedItemIndexes: [node.id] });
      expect(root.classes()).toContain(`${Classes.STATE}-${UISTATES.SELECTED}`);
    });

    test("has treeitem role and correct aria-level/selected", () => {
      const wrapper = mount(TreeViewItem, {
        props: {
          ...REQUIRED_PROPS,
          depth: 2,
          selectedItemIndexes: ["1"],
        },
      });
      const root = getRoot(wrapper);

      expect(root.attributes("role")).toBe("treeitem");
      expect(root.attributes("aria-level")).toBe("2");
      expect(root.attributes("aria-selected")).toBe("true");
    });

    test("data-node-id is stringified", () => {
      const wrapper = mount(TreeViewItem, {
        props: { ...REQUIRED_PROPS, node: { id: 123, name: "NumID" } },
      });
      expect(getRoot(wrapper).attributes("data-node-id")).toBe("123");
    });
  });

  describe("events", () => {
    test("should emit select:item event", async () => {
      const wrapper = mount(TreeViewItem, {
        props: {
          ...REQUIRED_PROPS,
          expandedItemIndexes: [],
          node,
          isSelectOnRelease: false,
        },
      });

      const root = getRoot(wrapper);

      await root.trigger("pointerdown");

      expect(wrapper.emitted("select:item")?.length).toBe(1);
      expect(wrapper.emitted("toggle:nested-item")?.length).toBe(1);
    });

    test("isSelectOnRelease selects on pointerup only", async () => {
      const wrapper = mount(TreeViewItem, {
        props: {
          ...REQUIRED_PROPS,
          node,
          expandedItemIndexes: [],
          isSelectOnRelease: true,
        },
      });
      const root = getRoot(wrapper);

      await root.trigger("pointerdown");
      expect(wrapper.emitted("select:item")).toBeFalsy();

      await root.trigger("pointerup");
      expect(wrapper.emitted("select:item")?.length).toBe(1);
    });

    test("emits payloads with correct args", async () => {
      const wrapper = mount(TreeViewItem, {
        props: { ...REQUIRED_PROPS, node, expandedItemIndexes: [] },
      });
      const root = getRoot(wrapper);
      await root.trigger("pointerdown");

      const selectItem = wrapper.emitted("select:item")?.[0]?.[0];
      const toggleNested = wrapper.emitted("toggle:nested-item")?.[0];

      expect(selectItem).toMatchObject({ id: "1", name: "Second" });
      expect(toggleNested?.[0]).toMatchObject({ id: "1" });
      expect(typeof toggleNested?.[1]).toBe("boolean");
    });
  });

  describe("slots", () => {
    test("should render default slot", () => {
      const slotContent = "Slot Content";
      const slot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mount(TreeViewItem, {
        props: REQUIRED_PROPS,
        slots: { default: slot },
      });

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Slot Content"`);
    });
  });
});
