<script setup lang="ts">
import { SHEET_PREFIX, type SheetProps } from "./Sheet";

import Surface from "@/components/atoms/containers/Surface.vue";

withDefaults(defineProps<SheetProps>(), {
  variant: "default",
  size: "md",
  isOpen: false,
  isDialog: false,
});
</script>

<template>
  <Surface
    v-if="isOpen"
    :class="[SHEET_PREFIX, { sheet_dialog: isDialog }]"
    :variant="variant"
    :size="size"
    :mode="mode"
    :tone="tone"
  >
    <div :class="`${SHEET_PREFIX}__content`">
      <slot></slot>
    </div>
  </Surface>
</template>

<style lang="scss">
@use "sass:map";

$tokenName: "sheet";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "molecules.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $min-height: px2rem(get($val, "root.min-height"));
      $border-radius: px2rem(get($val, "root.border-radius"));

      &_variant-#{$variant} {
        &.#{$prefix}__size-#{$size} {
          min-height: $min-height;
          border-radius: $border-radius $border-radius 0 0;
        }
      }
    }
  }
}

.#{$prefix} {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  overflow: auto;

  @include defineSizes();
}
</style>
