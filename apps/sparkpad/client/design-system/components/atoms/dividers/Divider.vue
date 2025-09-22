<script setup lang="ts">
import type { DividerProps } from "@/components/atoms";

withDefaults(defineProps<DividerProps>(), {
  as: "span",
  variant: "default",
  size: "md",
  mode: "neutral",
  tone: "primary",
  orientation: "horizontal",
  align: "center",
});
</script>

<template>
  <component
    :is="as"
    class="divider"
    :class="[
      `divider_variant-${variant}`,
      `divider_size-${size}`,
      `divider_mode-${mode}`,
      `divider_tone-${tone}`,
      `divider_orientation-${orientation}`,
      `divider_align-${align}`,
    ]"
    role="separator"
    :aria-orientation="orientation === 'vertical' ? 'vertical' : undefined"
  ></component>
</template>

<style lang="scss">
@use "sass:map";

@mixin defineSizes($map: get($atoms, "divider")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $border-width: px2rem(get($val, "root.border-width"));
      $padding: get($val, "root.padding");

      &_variant-#{$variant} {
        &.divider_size-#{$size} {
          &.divider_orientation {
            &-horizontal {
              border-bottom-style: solid;
              border-bottom-width: $border-width;

              &.divider_align {
                &-start {
                  margin: 0 0 $padding * 2 0;
                }

                &-center {
                  margin: $padding 0;
                }

                &-end {
                  margin: $padding * 2 0 0 0;
                }
              }
            }

            &-vertical {
              border-right-style: solid;
              border-right-width: $border-width;

              &.divider_align {
                &-start {
                  margin: 0 $padding * 2 0 0;
                }

                &-center {
                  margin: 0 $padding;
                }

                &-end {
                  margin: 0 0 0 $padding * 2;
                }
              }
            }
          }
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.atoms.divider")) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.divider_tone-#{$tone} {
          &.divider_orientation {
            &-horizontal {
              @include themify($themes) {
                border-bottom-color: themed(
                  "atoms.divider.#{$mode}.#{$tone}.root.border"
                );
              }
            }

            &-vertical {
              @include themify($themes) {
                border-right-color: themed(
                  "atoms.divider.#{$mode}.#{$tone}.root.border"
                );
              }
            }
          }
        }
      }
    }
  }
}

.divider {
  @extend %base-transition;

  @include defineSizes();
  @include defineThemes();
}
</style>
