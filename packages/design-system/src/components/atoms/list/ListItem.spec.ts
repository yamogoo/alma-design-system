import { ref, computed, nextTick } from "vue";
import { mount, VueWrapper } from "@vue/test-utils";

import { ListInjectionKey } from "@/components/molecules/list/List";
import ListItem from "./ListItem.vue";
import type { ListItemProps } from "./ListItem";

const __isHovered = ref(false);
vi.mock("@/composables/local", () => ({
  useHover: () => ({ isHovered: __isHovered }),
}));

enum Classes {
  ROOT = "list-item",
  VARIANT = `${Classes.ROOT}_variant`,
  SIZE = `${Classes.ROOT}_size`,
  MODE = `${Classes.ROOT}_mode`,
  TONE = `${Classes.ROOT}_tone`,
  STATE = `${Classes.ROOT}_state`,
  JOINED = `${Classes.ROOT}_joined`,
}

const getRoot = <T>(wrapper: VueWrapper<T>) =>
  wrapper.findComponent({ name: "ListItem" }).find(`.${Classes.ROOT}`);

const REQUIRED_PROPS: ListItemProps = {
  id: "",
  title: "Some Title",
};

const makeCtx = (opts?: {
  selectable?: boolean;
  joined?: boolean;
  currentShown?: boolean;
  selectedIds?: Array<string | number> | string | number | null;
  onSet?: (id: string | number) => void;
}) => {
  const selected = ref<
    Array<string | number> | string | number | null | undefined
  >(opts?.selectedIds ?? null);

  return {
    selectedItemIndexes: computed(() => selected.value ?? null),
    setSelectedItemIndexes: (id: string | number) => opts?.onSet?.(id),
    isSelectable: ref(!!opts?.selectable),
    isJoined: ref(opts?.joined ?? true),
    isCurrentItemShown: ref(!!opts?.currentShown),
  };
};

describe("ListItem", () => {
  beforeEach(() => {
    __isHovered.value = false;
  });

  describe("elements/classes", () => {
    test("should have props-based classes and joined modifier", () => {
      const wrapper = mount(ListItem, {
        props: {
          ...REQUIRED_PROPS,
          id: "x",
          variant: "default",
          size: "md",
          mode: "neutral",
          tone: "primary",
          isJoined: true,
        },
      });

      const root = getRoot(wrapper);

      expect(root.classes()).toContain(`${Classes.VARIANT}-default`);
      expect(root.classes()).toContain(`${Classes.SIZE}-md`);
      expect(root.classes()).toContain(`${Classes.MODE}-neutral`);
      expect(root.classes()).toContain(`${Classes.TONE}-primary`);
      expect(root.classes()).toContain(Classes.JOINED);
    });

    test("should render fallback content (title/description) if no default slot", () => {
      const wrapper = mount(ListItem, {
        props: {
          ...REQUIRED_PROPS,
          id: "x",
          title: "Hello",
          description: "World",
        },
      });

      const text = wrapper.text();
      expect(text).toContain("Hello");
      expect(text).toContain("World");
    });

    test("should render slots (default/prepend/append) when provided", () => {
      const wrapper = mount(ListItem, {
        props: { ...REQUIRED_PROPS, id: "x" },
        slots: {
          prepend: '<span data-testid="prep">P</span>',
          default: '<span data-testid="cont">C</span>',
          append: '<span data-testid="app">A</span>',
        },
      });

      expect(wrapper.find('[data-testid="prep"]').exists()).toBeTruthy();
      expect(wrapper.find('[data-testid="cont"]').exists()).toBeTruthy();
      expect(wrapper.find('[data-testid="app"]').exists()).toBeTruthy();
    });
  });

  describe("attributes", () => {
    test("when not selectable → role=listitem, no aria-selected, tabindex from isFocused", () => {
      const ctx = makeCtx({ selectable: false });
      const wrapper = mount(ListItem, {
        props: { ...REQUIRED_PROPS, id: "x", isFocused: true },
        global: { provide: { [ListInjectionKey]: ctx } },
      });

      const root = getRoot(wrapper);

      expect(root.attributes("role")).toBe("listitem");
      expect(root.attributes("aria-selected")).toBeUndefined();
      expect(root.attributes("tabindex")).toBe("0");
    });

    test("when selectable → role=option and aria-selected reflects selection", async () => {
      const ctx = makeCtx({ selectable: true, selectedIds: "x" });
      const wrapper = mount(ListItem, {
        props: { ...REQUIRED_PROPS, id: "x" },
        global: { provide: { [ListInjectionKey]: ctx } },
      });

      await nextTick();
      const root = getRoot(wrapper);

      expect(root.attributes("role")).toBe("option");
      expect(root.attributes("aria-selected")).toBeTruthy();
    });

    test("tabindex is -1 when not focused", () => {
      const ctx = makeCtx({ selectable: true });

      const wrapper = mount(ListItem, {
        props: { ...REQUIRED_PROPS, id: "x", isFocused: false },
        global: { provide: { [ListInjectionKey]: ctx } },
      });

      const root = getRoot(wrapper);

      expect(root.attributes("tabindex")).toBe("-1");
    });
  });

  describe("provide/inject", () => {
    test("prop isActive overrides injected selection", () => {
      const ctx = makeCtx({ selectable: true, selectedIds: null });

      const wrapper = mount(ListItem, {
        props: { ...REQUIRED_PROPS, id: "x", isActive: true },
        global: { provide: { [ListInjectionKey]: ctx } },
      });

      expect(getRoot(wrapper).classes()).toContain(`${Classes.STATE}-selected`);
    });
  });

  describe("states", () => {
    test("hovered state when selectable and hovered", async () => {
      const ctx = makeCtx({ selectable: true, selectedIds: null });

      const wrapper = mount(ListItem, {
        props: { ...REQUIRED_PROPS, id: "x" },
        global: { provide: { [ListInjectionKey]: ctx } },
      });

      expect(getRoot(wrapper).classes()).toContain(`${Classes.STATE}-normal`);

      __isHovered.value = true;
      await wrapper.vm.$nextTick();

      expect(getRoot(wrapper).classes()).toContain(`${Classes.STATE}-hovered`);
    });

    test("if ctx.isSelectable=false → state stays normal even on hover", async () => {
      const ctx = makeCtx({ selectable: false });

      const wrapper = mount(ListItem, {
        props: { ...REQUIRED_PROPS, id: "x" },
        global: { provide: { [ListInjectionKey]: ctx } },
      });

      __isHovered.value = true;
      await wrapper.vm.$nextTick();

      expect(getRoot(wrapper).classes()).toContain(`${Classes.STATE}-normal`);
    });
  });

  describe("events", () => {
    test("isSelectOnRelease=true (default): select only on pointerup", async () => {
      const onSet = vi.fn();
      const ctx = makeCtx({ selectable: true, onSet });

      const wrapper = mount(ListItem, {
        props: { ...REQUIRED_PROPS, id: "x", isSelectOnRelease: true },
        global: { provide: { [ListInjectionKey]: ctx } },
      });

      const root = getRoot(wrapper);

      await root.trigger("pointerdown");
      expect(onSet).not.toHaveBeenCalled();

      await root.trigger("pointerup");
      expect(onSet).toHaveBeenCalledWith("x");
    });

    test("isSelectOnRelease=false: select on pointerdown", async () => {
      const onSet = vi.fn();
      const ctx = makeCtx({ selectable: true, onSet });

      const wrapper = mount(ListItem, {
        props: { ...REQUIRED_PROPS, id: "x", isSelectOnRelease: false },
        global: { provide: { [ListInjectionKey]: ctx } },
      });

      const root = getRoot(wrapper);

      await root.trigger("pointerdown");
      expect(onSet).toHaveBeenCalledWith("x");
    });

    test("isDisabled prevents select", async () => {
      const onSet = vi.fn();
      const ctx = makeCtx({ selectable: true, onSet });

      const wrapper = mount(ListItem, {
        props: { ...REQUIRED_PROPS, id: "x", isDisabled: true },
        global: { provide: { [ListInjectionKey]: ctx } },
      });

      const root = getRoot(wrapper);

      await root.trigger("pointerup");
      expect(onSet).not.toHaveBeenCalled();
    });

    test("Enter/Space select; ArrowDown/ArrowUp emit focus:next/prev", async () => {
      const onSet = vi.fn();
      const ctx = makeCtx({ selectable: true, onSet });

      const wrapper = mount(ListItem, {
        props: { ...REQUIRED_PROPS, id: "x" },
        global: { provide: { [ListInjectionKey]: ctx } },
      });

      const root = getRoot(wrapper);

      await root.trigger("keydown", { key: "Enter" });
      await root.trigger("keydown", { key: " " });

      expect(onSet).toHaveBeenCalledTimes(2);
      expect(onSet).toHaveBeenNthCalledWith(1, "x");
      expect(onSet).toHaveBeenNthCalledWith(2, "x");

      await root.trigger("keydown", { key: "ArrowDown" });
      await root.trigger("keydown", { key: "ArrowUp" });

      const focusNext = wrapper.emitted("focus:next");
      const focusPrev = wrapper.emitted("focus:prev");
      expect(focusNext?.length).toBe(1);
      expect(focusPrev?.length).toBe(1);
    });
  });

  describe("styles", () => {
    test("cursor is pointer when selectable, auto otherwise", () => {
      const ctxSelectable = makeCtx({ selectable: true });
      const ctxPlain = makeCtx({ selectable: false });

      const w1 = mount(ListItem, {
        props: { ...REQUIRED_PROPS, id: "x" },
        global: { provide: { [ListInjectionKey]: ctxSelectable } },
      });

      const w2 = mount(ListItem, {
        props: { ...REQUIRED_PROPS, id: "y" },
        global: { provide: { [ListInjectionKey]: ctxPlain } },
      });

      expect(getRoot(w1).attributes("style") || "").toContain(
        "cursor: pointer"
      );
      expect(getRoot(w2).attributes("style") || "").toContain("cursor: auto");
    });
  });
});
