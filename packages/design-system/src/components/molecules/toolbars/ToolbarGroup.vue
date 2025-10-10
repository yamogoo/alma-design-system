<script setup lang="ts">
import { UIFACETS } from "@/constants/ui";

import { TOOLBAR_GROUP_PREFIX, type ToolbarGroupProps } from "./ToolbarGroup";

import Group from "@/components/molecules/containers/Group.vue";

withDefaults(defineProps<ToolbarGroupProps>(), {
  as: "div",
  variant: "default",
  size: "md",
  mode: "neutral",
  tone: "canvas",
  bordered: true,
  orientation: "horizontal",
  direction: "forward",
});
</script>

<template>
  <Group
    :class="[
      TOOLBAR_GROUP_PREFIX,
      `${TOOLBAR_GROUP_PREFIX}_${UIFACETS.VARIANT}-${variant}`,
      `${TOOLBAR_GROUP_PREFIX}_${UIFACETS.SIZE}-${size}`,
    ]"
    :variant="'block'"
    :size="size"
    :mode="mode"
    :tone="tone"
    :bordered="bordered"
    :orientation="orientation"
    :direction="direction"
    role="toolbar"
  >
    <slot></slot>
  </Group>
</template>

<style lang="scss">
$tokenName: "toolbar-group";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "molecules.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $min-height: px2rem(get($val, "root.min-height"));

      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          min-height: $min-height;
        }
      }
    }
  }
}

.#{$prefix} {
  @include defineSizes();
}
</style>
