<script setup lang="ts">
import { type SheetProps } from "./Sheet";

import Surface from "@/components/atoms/containers/Surface.vue";

const PREFIX = "sheet";

withDefaults(defineProps<SheetProps>(), {
  isOpen: false,
  isDialog: false,
});
</script>

<template>
  <Surface
    v-if="isOpen"
    :class="[PREFIX, { sheet_dialog: isDialog }]"
    :variant="variant"
    :size="size"
    :mode="mode"
    :tone="tone"
  >
    <div :class="`${PREFIX}__content`">
      <slot></slot>
    </div>
  </Surface>
</template>

<style lang="scss">
@use "sass:map";

$prefix: sheet;

@mixin defineSizes($map: get($components, "molecules.#{$prefix}")) {
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

.sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  overflow: auto;

  @include defineSizes();
}
</style>
