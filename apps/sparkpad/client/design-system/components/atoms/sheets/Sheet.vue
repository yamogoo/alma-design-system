<script setup lang="ts">
import { type SheetProps } from "@/components/atoms";

withDefaults(defineProps<SheetProps>(), {
  isOpen: false,
  isDialog: false,
});
</script>

<template>
  <div v-if="isOpen" class="sheet" :class="{ sheet_dialog: isDialog }">
    <div class="sheet__content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
@use "sass:map";

@mixin defineSizes($map: get($atoms, "sheet")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $min-height: px2rem(get($val, "root.min-height"));
      $border-radius: px2rem(get($val, "root.border-radius"));

      &_variant-#{$variant} {
        &.sheet__size-#{$size} {
          min-height: $min-height;
          border-radius: $border-radius $border-radius 0 0;
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.atoms.sheet")) {
  @each $mode, $modes in $map {
    &_mode-#{$mode} {
      @include themify($themes) {
        background-color: themed("atoms.sheet.#{$mode}.background.normal");
        box-shadow: 0 -2px 12px themed("atoms.sheet.#{$mode}.shadow.normal");
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
  @include defineThemes();
}
</style>
