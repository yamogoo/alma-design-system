<script setup lang="ts">
import { computed, onMounted, useTemplateRef, watch } from "vue";
import g from "gsap";

import { useHover } from "@/composables/local";

import { Icon, Text } from "@/components/atoms";
import type { TreeViewItemProps, TreeViewNode } from "@/components/molecules";

defineOptions({ name: "TreeViewItem" });

const props = defineProps<TreeViewItemProps>();

const emit = defineEmits<{
  (e: "toggle:nested-item", node: TreeViewNode, isNext: boolean): void;
  (e: "select:nested-item", node: TreeViewNode, isChecked: boolean): void;
  (e: "select:item", node: TreeViewNode): void;
  (e: "keydown:item", ev: KeyboardEvent, node: TreeViewNode): void;
}>();

const refRoot = useTemplateRef<HTMLDivElement | null>("root");
const refIcon = useTemplateRef<InstanceType<typeof Icon> | null>("icon");

const { isHovered } = useHover(refRoot);

const isSelected = computed(() => {
  const { id } = props.node;
  return !!props.selectedItemIndexes?.includes(id);
});

const isExpanded = computed(() => {
  const { id } = props.node;
  return !!props.expandedItemIndexes?.includes(id);
});

// const isLoading = computed(() => {
//   const { id } = props.node;
//   return !!props.loadingItemIndexes?.includes(id);
// });

const depth = computed(() => props.depth);

const onToggleItem = (node: TreeViewNode, isNext: boolean): void => {
  emit("toggle:nested-item", node, isNext);
};

const onSelectItem = (node: TreeViewNode, isChecked: boolean): void => {
  emit("select:nested-item", node, isChecked);

  if (!props.node.isLeaf)
    emit("toggle:nested-item", props.node, !isExpanded.value);
};

const onItemPress = (e: PointerEvent, isPressed: boolean): void => {
  e.preventDefault();
  const shouldSelect = props.isSelectOnRelease ? !isPressed : isPressed;

  if (shouldSelect) {
    emit("select:item", props.node);
    if (!props.node.isLeaf)
      emit("toggle:nested-item", props.node, !isExpanded.value);
  }
};

const onItemKeyDown = (e: KeyboardEvent): void => {
  emit("keydown:item", e, props.node);
};

/* * * Animations * * */

const ICON_DURATION = 0.2;

const onAnimIcon = (isExpanded: boolean, duration = ICON_DURATION): void => {
  const el = refIcon.value?.root;

  if (el) {
    g.to(el, {
      rotate: isExpanded ? 0 : -90,
      ease: "power4.out",
      duration: duration,
    });
  }
};

watch(
  isExpanded,
  async (newValue) => {
    onAnimIcon(newValue);
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  onAnimIcon(isExpanded.value, 0);
});
</script>

<template>
  <div
    ref="root"
    class="tree-view-item"
    :class="[
      node.isLeaf ? 'tree-view-item_type-file' : 'tree-view-item_type-group',
      `tree-view-item_state-${isSelected ? 'selected' : isHovered ? 'hovered' : 'normal'}`,
    ]"
    role="treeitem"
    :aria-level="depth"
    :aria-selected="isSelected"
    :aria-expanded="node.isLeaf ? undefined : isExpanded"
    :data-node-id="String(node.id)"
    tabindex="-1"
    @pointerdown="(e) => onItemPress(e, true)"
    @pointerup="(e) => onItemPress(e, false)"
    @keydown="onItemKeyDown"
  >
    <slot>
      <div class="tree-view-item__content">
        <Icon
          v-if="!node.isLeaf"
          ref="icon"
          class="tree-view-item__caret"
          :variant="'default'"
          name="down"
          appearance="outline"
          weight="400"
          aria-label="Expand/Collapse"
          :aria-expanded="isExpanded"
        />
        <Text class="tree-view-item__label">{{ node.name }}</Text>
      </div>
    </slot>
  </div>
  <div
    v-if="!node.isLeaf && isExpanded"
    role="group"
    class="tree-view-item tree-view-item_type-group"
  >
    <TreeViewItem
      v-for="child in node.children || []"
      :key="String(child.id)"
      :node="child"
      :depth="depth + 1"
      :expanded-item-indexes="expandedItemIndexes"
      :selected-item-indexes="selectedItemIndexes"
      :loading-item-indexes="loadingItemIndexes"
      :is-checkable="isCheckable"
      :is-select-on-release="isSelectOnRelease"
      @toggle:nested-item="onToggleItem"
      @select:nested-item="onSelectItem"
      @select:item="(nestedNode) => emit('select:item', nestedNode)"
      @keydown:item="(e, nestedNode) => emit('keydown:item', e, nestedNode)"
    >
    </TreeViewItem>
  </div>
</template>

<style lang="scss">
$prefix: "tree-view";

@mixin defineSizes($map: get($molecules, "tree-view")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          $root-gap: px2rem(get($val, "root.gap"));

          $gap: px2rem(get($val, "item.root.gap"));
          $indent: px2rem(get($val, "item.root.indent"));
          $padding: px2rem(get($val, "item.root.padding"));
          $border-radius: px2rem(get($val, "item.root.border-radius"));

          $label-font-style: get($val, "item.label.font-style");

          $caret-size: get($val, "item.caret.size");

          .#{$prefix}-item {
            gap: $root-gap;
            padding-left: $indent;
            border-radius: $border-radius;

            &__content {
              gap: $gap;
              padding: $padding;
            }

            &__label {
              @extend %t__#{$label-font-style};
            }

            &__caret {
              @include box($caret-size);
            }
          }
        }
      }
    }
  }
}

@mixin stateStyles($mode, $tone, $state) {
  &-#{$state} {
    &.#{$prefix}-item {
      @include themify($themes) {
        background-color: themed(
          "molecules.tree-view.#{$mode}.#{$tone}.item.root.background.#{$state}"
        );
      }
    }

    .#{$prefix}-item__label {
      @include themify($themes) {
        color: themed(
          "molecules.tree-view.#{$mode}.#{$tone}.item.label.color.#{$state}"
        );
      }
    }

    .#{$prefix}-item__caret {
      @include themify($themes) {
        fill: themed(
          "molecules.tree-view.#{$mode}.#{$tone}.item.caret.color.#{$state}"
        );
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.molecules.tree-view")) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.#{$prefix}_tone-#{$tone} {
          .#{$prefix}-item_state {
            @each $state in ("normal", "hovered", "selected") {
              @include stateStyles($mode, $tone, $state);
            }
          }
        }
      }
    }
  }
}

.#{$prefix} {
  @include defineSizes();
  @include defineThemes();

  &-item {
    position: relative;
    display: flex;
    flex-direction: column;
    cursor: pointer;

    &__content {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }

  &-children {
    display: block;
  }
}
</style>
