<script setup lang="ts">
import { computed, onMounted, useTemplateRef, watch } from "vue";
import g from "gsap";

import { useHover } from "@/composables/local";

import { Icon, Text } from "@/components/atoms";
import type { TreeViewItemProps, TreeViewNode } from "@/components/molecules";

defineOptions({ name: "TreeViewItem" });

const PREFIX = "tree-view-item";

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

  return typeof props.selectedItemIndexes === "object"
    ? !!props.selectedItemIndexes?.includes(id)
    : props.selectedItemIndexes === id;
});

const isExpanded = computed(() => {
  const { id } = props.node;

  return typeof props.expandedItemIndexes === "object"
    ? !!props.expandedItemIndexes?.includes(id)
    : props.expandedItemIndexes === id;
});

// const isLoading = computed(() => {
//   const { id } = props.node;

//   return typeof props.loadingItemIndexes === "object"
//     ? !!props.loadingItemIndexes?.includes(id)
//     : props.loadingItemIndexes === id;
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
  (newValue) => {
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
    :class="[
      PREFIX,
      node.isLeaf ? `${PREFIX}_type-file` : `${PREFIX}_type-group`,
      `${PREFIX}_state-${isSelected ? 'selected' : isHovered ? 'hovered' : 'normal'}`,
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
      <div :class="`${PREFIX}__content`">
        <Icon
          v-if="!node.isLeaf"
          ref="icon"
          :class="`${PREFIX}__caret`"
          :variant="'default'"
          :size="'xs'"
          name="down"
          appearance="outline"
          weight="300"
          aria-label="Expand/Collapse"
          :aria-expanded="isExpanded"
        />
        <Icon
          v-if="isIconShown"
          :class="[
            `${PREFIX}__icon`,
            `${PREFIX}__icon-${node.isLeaf ? 'file' : 'group'}`,
          ]"
          :variant="'default'"
          :size="'sm'"
          :name="node.isLeaf ? 'blankSheet' : 'folderClosed'"
          appearance="outline"
          weight="300"
          aria-label="Expand/Collapse"
          :aria-expanded="isExpanded"
        />
        <Text :class="`${PREFIX}__label`">
          {{ node.name }}
        </Text>
      </div>
    </slot>
  </div>
  <div
    v-if="!node.isLeaf && isExpanded"
    role="group"
    :class="[PREFIX, `${PREFIX}_type-group`]"
    data-testid="tree-view-item_type-group"
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
$root-prefix: "tree-view";
$prefix: "tree-view-item";

@mixin defineSizes($map: get($components, "molecules.#{$root-prefix}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$root-prefix}_size-#{$size} {
          $root-gap: px2rem(get($val, "root.gap"));

          $gap: px2rem(get($val, "item.root.gap"));
          $indent: px2rem(get($val, "item.root.indent"));
          $padding: px2rem(get($val, "item.root.padding"));
          $border-radius: px2rem(get($val, "item.root.border-radius"));

          $label-font-style: get($val, "item.label.font-style");

          $caret-size: get($val, "item.caret.size");

          .#{$prefix} {
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
    &.#{$prefix} {
      @include themify($themes) {
        background-color: themed(
          "components.molecules.#{$root-prefix}.#{$mode}.#{$tone}.item.root.background.#{$state}"
        );
      }
    }

    .#{$prefix}__label {
      @include themify($themes) {
        color: themed(
          "components.molecules.#{$root-prefix}.#{$mode}.#{$tone}.item.label.color.#{$state}"
        );
      }
    }

    .#{$prefix}__caret {
      @include themify($themes) {
        fill: themed(
          "components.molecules.#{$root-prefix}.#{$mode}.#{$tone}.item.caret.color.#{$state}"
        );
      }
    }
  }
}

@mixin defineThemes(
  $map: get($themes, "light.components.molecules.#{$root-prefix}")
) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.#{$root-prefix}_tone-#{$tone} {
          .#{$prefix}_state {
            @each $state in ("normal", "hovered", "selected") {
              @include stateStyles($mode, $tone, $state);
            }
          }
        }
      }
    }
  }
}

.#{$root-prefix} {
  @include defineSizes();
  @include defineThemes();

  .#{$prefix} {
    position: relative;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    outline: none;

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
