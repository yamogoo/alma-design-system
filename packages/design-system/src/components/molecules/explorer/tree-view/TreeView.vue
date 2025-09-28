<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from "vue";

import {
  TreeViewItem,
  type TreeViewNode,
  type TreeViewNodeID,
  type TreeViewProps,
} from "@/components/molecules";

const PREFIX = "tree-view";

const props = withDefaults(defineProps<TreeViewProps>(), {
  variant: "default",
  size: "md",
  mode: "neutral",
  tone: "primary",
  selectedItemIndexes: null,
  expandedItemIndexes: null,
  loadingItemIndexes: () => [],
  isMultiSelect: false,
  isCheckable: false,
  isSelectOnRelease: true,
  isExpandOnItemPress: false,
  isIconShown: false,
  ariaLabel: "Files",
});

const emit = defineEmits<{
  (
    e: "update:selected-item-indexes",
    value: TreeViewNodeID[] | TreeViewNodeID | null
  ): void;
  (e: "select:item", node: TreeViewNode): void;
  (e: "toggle:item", node: TreeViewNode, nextExpanded: boolean): void;
}>();

const refRoot = useTemplateRef<HTMLElement | null>("root");

const localSelectedItemIndexes = ref<TreeViewNodeID[]>([]);
const localExpandedItemIndexes = ref<TreeViewNodeID[]>([]);
const localLoadingItemIndexes = ref<TreeViewNodeID[]>([]);

watch(
  () => props.selectedItemIndexes,
  (newIndexes) => {
    if (props.isMultiSelect)
      localSelectedItemIndexes.value = Array.isArray(newIndexes)
        ? (newIndexes as TreeViewNodeID[])
        : newIndexes == null
          ? []
          : [newIndexes as TreeViewNodeID];
    else
      localSelectedItemIndexes.value = Array.isArray(newIndexes)
        ? newIndexes[0]
          ? [newIndexes[0] as TreeViewNodeID]
          : []
        : newIndexes == null
          ? []
          : [newIndexes as TreeViewNodeID];
  },
  { immediate: true }
);

watch(
  () => props.expandedItemIndexes,
  (newValue) => {
    typeof newValue === "object"
      ? (localExpandedItemIndexes.value = newValue ? [...newValue] : [])
      : (localExpandedItemIndexes.value = [newValue]);
  },
  { immediate: true }
);

watch(
  () => props.loadingItemIndexes,
  (newValue) => {
    typeof newValue === "object"
      ? (localLoadingItemIndexes.value = newValue ? [...newValue] : [])
      : (localLoadingItemIndexes.value = [newValue]);
  },
  { immediate: true }
);

const onToggle = (node: TreeViewNode, next: boolean) => {
  const isControlled = props.expandedItemIndexes != null;
  if (!isControlled) {
    const set = new Set(localExpandedItemIndexes.value);
    next ? set.add(node.id) : set.delete(node.id);
    localExpandedItemIndexes.value = [...set];
  }
  emit("toggle:item", node, next);
};

const updateSelection = (arr: TreeViewNodeID[]) => {
  if (props.isMultiSelect) {
    emit("update:selected-item-indexes", arr);
  } else {
    const value = arr[0] ?? null;
    emit("update:selected-item-indexes", value);
  }
  localSelectedItemIndexes.value = arr;
};

const onSelect = (node: TreeViewNode, checked: boolean) => {
  const set = new Set(localSelectedItemIndexes.value);
  if (checked) set.add(node.id);
  else set.delete(node.id);
  updateSelection(Array.from(set));
};

const onRowClick = (node: TreeViewNode) => {
  emit("select:item", node);

  // expand on item click if it's a group (not a leaf)
  if (props.isExpandOnItemPress && !node.isLeaf) {
    const isOpen = localExpandedItemIndexes.value.includes(node.id);
    onToggle(node, !isOpen);
  }

  if (props.isMultiSelect) {
    const set = new Set(localSelectedItemIndexes.value);
    set.has(node.id) ? set.delete(node.id) : set.add(node.id);
    updateSelection(Array.from(set));
  } else {
    updateSelection([node.id]);
  }
};

/* Keyboard navigation */
function buildFlat(nodes: TreeViewNode[], out: TreeViewNode[] = []) {
  for (const n of nodes) {
    out.push(n);
    if (
      !n.isLeaf &&
      localExpandedItemIndexes.value.includes(n.id) &&
      Array.isArray(n.children)
    )
      buildFlat(n.children, out);
  }
  return out;
}

const focusById = (id: TreeViewNodeID) => {
  const el = refRoot.value?.querySelector<HTMLElement>(
    `[data-node-id="${CSS.escape(String(id))}"]`
  );
  el?.focus();
};

const onRowKeydown = (e: KeyboardEvent, node: TreeViewNode) => {
  const flat = buildFlat(props.nodes, []);
  const idx = flat.findIndex((n) => n.id === node.id);

  if (idx < 0) return;

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      flat[idx + 1] && focusById(flat[idx + 1].id);
      break;
    case "ArrowUp":
      e.preventDefault();
      flat[idx - 1] && focusById(flat[idx - 1].id);
      break;
    case "ArrowRight":
      if (!node.isLeaf && !localExpandedItemIndexes.value.includes(node.id)) {
        e.preventDefault();
        onToggle(node, true);
      }
      break;
    case "ArrowLeft":
      if (!node.isLeaf && localExpandedItemIndexes.value.includes(node.id)) {
        e.preventDefault();
        onToggle(node, false);
      }
      break;
    case "Enter":
    case " ":
      e.preventDefault();
      onRowClick(node);
      break;
  }
};

// initial focus when nodes appear
watch(
  () => props.nodes,
  async (v) => {
    if (!v?.length) return;
    await nextTick();
    focusById(v[0].id);
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div
    ref="root"
    class="tree-view"
    :class="[
      `${PREFIX}_variant-${variant}`,
      `${PREFIX}_size-${size}`,
      `${PREFIX}_mode-${mode}`,
      `${PREFIX}_tone-${tone}`,
    ]"
    role="tree"
    :aria-label="ariaLabel"
    :aria-multiselectable="isMultiSelect ? 'true' : 'false'"
  >
    <TreeViewItem
      v-for="node in nodes"
      :key="String(node.id)"
      :node="node"
      :depth="1"
      :expanded-item-indexes="localExpandedItemIndexes"
      :selected-item-indexes="localSelectedItemIndexes"
      :loading-item-indexes="localLoadingItemIndexes"
      :is-checkable="isCheckable"
      :is-select-on-release="isSelectOnRelease"
      @toggle:nested-item="onToggle"
      @select:nested-item="onSelect"
      @select:item="onRowClick"
      @keydown:item="onRowKeydown"
    >
      <slot></slot>
    </TreeViewItem>
  </div>
</template>

<style lang="scss">
$prefix: "tree-view";

@mixin defineSizes($map: get($molecules, "#{$prefix}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $gap: px2rem(get($val, "root.gap"));
      $padding: px2rem(get($val, "root.padding"));

      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          gap: $gap;
          padding: $padding;
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.molecules.#{$prefix}")) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.#{$prefix}_tone-#{$tone} {
          @include themify($themes) {
            background-color: themed(
              "molecules.#{$prefix}.#{$mode}.#{$tone}.root.background"
            );
          }
        }
      }
    }
  }
}

.#{$prefix} {
  position: relative;
  display: flex;
  flex-direction: column;

  @include defineSizes();
  @include defineThemes();
}
</style>
