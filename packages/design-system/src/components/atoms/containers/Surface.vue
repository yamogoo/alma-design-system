<script setup lang="ts">
import { useTemplateRef } from "vue";

import type { SurfaceProps } from "./Surface";

const PREFIX = "surface";

withDefaults(defineProps<SurfaceProps>(), {
  as: "div",
  bordered: false,
});

const root = useTemplateRef("root");

defineExpose({
  root,
});
</script>

<template>
  <component
    :is="as"
    ref="root"
    :class="[
      PREFIX,
      {
        [`${PREFIX}_variant-${variant}`]: !!variant,
        [`${PREFIX}_size-${size}`]: !!size,
        [`${PREFIX}_mode-${mode}`]: !!mode,
        [`${PREFIX}_tone-${tone}`]: !!tone,
        [`${PREFIX}_bordered`]: bordered,
      },
    ]"
  >
    <slot></slot>
  </component>
</template>

<style lang="scss">
$prefix: surface;

@mixin defineSizes($map: get($components, "atoms.#{$prefix}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          $border-radius: px2rem(get($val, "root.border-radius"));
          $border-width: px2rem(get($val, "root.border-width"));
          border-radius: $border-radius;

          &.#{$prefix}_bordered {
            border-width: $border-width;
          }
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.components.atoms.#{$prefix}")) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.#{$prefix}_tone-#{$tone} {
          @include defineSurfaceThemes($prefix, $mode, $tone);

          // divider
          &.#{$prefix}divider {
            &.#{$prefix}orientation-horizontal {
              @include themify($themes) {
                border-right-color: themed(
                  "components.atoms.#{$prefix}.#{$mode}.#{$tone}.root.divider"
                );
              }
            }

            &.#{$prefix}orientation-vertical {
              @include themify($themes) {
                border-bottom-color: themed(
                  "components.atoms.#{$prefix}.#{$mode}.#{$tone}.root.divider"
                );
              }
            }
          }
        }
      }
    }
  }
}

.#{$prefix} {
  position: relative;
  display: block;
  @include box(100%);
  border-style: solid;
  border-width: 0;
  @extend %base-transition;

  @include defineSizes();
  @include defineThemes();
}
</style>
