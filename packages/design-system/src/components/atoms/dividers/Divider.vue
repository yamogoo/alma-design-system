<script setup lang="ts">
import { DIVIDER_PREFIX, type DividerProps } from "./Divider";

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
      DIVIDER_PREFIX,
      `${DIVIDER_PREFIX}_variant-${variant}`,
      `${DIVIDER_PREFIX}_size-${size}`,
      `${DIVIDER_PREFIX}_mode-${mode}`,
      `${DIVIDER_PREFIX}_tone-${tone}`,
      `${DIVIDER_PREFIX}_orientation-${orientation}`,
      `${DIVIDER_PREFIX}_align-${align}`,
    ]"
    role="separator"
    :aria-orientation="orientation === 'vertical' ? 'vertical' : undefined"
  ></component>
</template>

<style lang="scss">
$tokenName: "divider";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "atoms.#{$tokenName}")) {
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

@mixin defineThemes(
  $map: get($themes, "light.components.atoms.#{$tokenName}")
) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.#{$prefix}_tone-#{$tone} {
          &.#{$prefix}_orientation {
            &-horizontal {
              @include themify($themes) {
                border-bottom-color: themed(
                  "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.root.border"
                );
              }
            }

            &-vertical {
              @include themify($themes) {
                border-right-color: themed(
                  "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.root.border"
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
