<script setup lang="ts">
import type { ToolbarGroupProps } from "./ToolbarGroup";

import Group from "@/components/atoms/containers/Group.vue";

const PREFIX = "toolbar-group";

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
    :class="
      (PREFIX, [`${PREFIX}_variant-${variant}`, `${PREFIX}_size-${size}`])
    "
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
$prefix: toolbar-group;

@mixin defineSizes($map: get($components, "molecules.#{$prefix}")) {
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
