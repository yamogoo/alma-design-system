<script setup lang="ts">
import type { DividerProps } from "./Divider";

const PREFIX = "divider";

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
    :class="[
      PREFIX,
      `${PREFIX}_variant-${variant}`,
      `${PREFIX}_size-${size}`,
      `${PREFIX}_mode-${mode}`,
      `${PREFIX}_tone-${tone}`,
      `${PREFIX}_orientation-${orientation}`,
      `${PREFIX}_align-${align}`,
    ]"
    role="separator"
    :aria-orientation="orientation === 'vertical' ? 'vertical' : undefined"
  ></component>
</template>

<style lang="scss">
$prefix: divider;

@mixin defineSizes($map: get($components, "atoms.#{$prefix}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $border-width: px2rem(get($val, "root.border-width"));
      $padding: get($val, "root.padding");

      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          &.#{$prefix}_orientation {
            &-horizontal {
              border-bottom-style: solid;
              border-bottom-width: $border-width;

              &.#{$prefix}_align {
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

              &.#{$prefix}_align {
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

@mixin defineThemes($map: get($themes, "light.components.atoms.#{$prefix}")) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.#{$prefix}_tone-#{$tone} {
          &.#{$prefix}_orientation {
            &-horizontal {
              @include themify($themes) {
                border-bottom-color: themed(
                  "components.atoms.#{$prefix}.#{$mode}.#{$tone}.root.border"
                );
              }
            }

            &-vertical {
              @include themify($themes) {
                border-right-color: themed(
                  "components.atoms.#{$prefix}.#{$mode}.#{$tone}.root.border"
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
  @extend %base-transition;

  @include defineSizes();
  @include defineThemes();
}
</style>
