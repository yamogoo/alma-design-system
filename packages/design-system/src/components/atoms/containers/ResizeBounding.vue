<script setup lang="ts">
import { UIFACETS } from "@/constants/ui";

import Resizer from "vue3-resize-bounding";

import resizeBounding from "@/tokens/src/components/atoms/resizeBounding.json";

import {
  RESIZE_BOUNDING_PREFIX,
  PREFIX_WITH_DIVIDER,
  type ResizeBoundingProps,
} from "./ResizeBounding";

const props = withDefaults(defineProps<ResizeBoundingProps>(), {
  variant: "default",
  size: "md",
  mode: "accent",
  tone: "primary",
});

const emits = defineEmits<{
  (e: "update:width", width: number): void;
  (e: "update:height", height: number): void;
}>();

const variant = props.variant;
const size = props.size;

const componentToken = resizeBounding[variant][size];
const activeAreaWidth = componentToken.root.activeAreaWidth.$value;
const isKnobShown = componentToken.knob.show.$value;
const splitterWidth = componentToken.splitter.width.$value;
</script>

<template>
  <Resizer
    :width="width"
    :min-width="minWidth"
    :max-width="maxWidth"
    :height="height"
    :min-height="minHeight"
    :max-height="maxHeight"
    :data-testid="RESIZE_BOUNDING_PREFIX"
    :class="[
      `${RESIZE_BOUNDING_PREFIX}_${UIFACETS.VARIANT}-${variant}`,
      `${RESIZE_BOUNDING_PREFIX}_${UIFACETS.SIZE}-${size}`,
      `${RESIZE_BOUNDING_PREFIX}_${UIFACETS.MODE}-${mode}`,
      `${RESIZE_BOUNDING_PREFIX}_${UIFACETS.TONE}-${tone}`,
    ]"
    :options="{
      prefix: PREFIX_WITH_DIVIDER,
      width: 4,
      splitterWidthNormal: splitterWidth,
      splitterWidthActive: splitterWidth,
      activeAreaWidth,
      position: 'internal',
      knob: {
        show: isKnobShown,
      },
      touchActions: true,
    }"
    @update:width="(width) => emits('update:width', width)"
    @update:height="(height) => emits('update:height', height)"
  >
    <slot></slot>
    <template #knob></template>
  </Resizer>
</template>

<style lang="scss">
$tokenName: "resize-bounding";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "atoms.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          $knob-width: px2rem(get($val, "knob.width"));
          $knob-height: px2rem(get($val, "knob.height"));

          .#{$prefix}__knob {
            width: $knob-width;
            height: $knob-height;
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
          .#{$prefix}__pane {
            // normal state:
            &:not(.active) {
              .#{$prefix}__splitter {
                @include themify($themes) {
                  background: rgba(
                    themed(
                      "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.splitter.normal"
                    ),
                    0
                  ) !important;
                }
              }

              .#{$prefix}__knob {
                @include themify($themes) {
                  background: themed(
                    "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.knob.normal"
                  ) !important;
                }
              }
            }

            // hovered/selected pane:
            &.active {
              .#{$prefix}__splitter {
                @include themify($themes) {
                  background: rgba(
                    themed(
                      "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.splitter.active"
                    ),
                    1
                  ) !important;
                }

                .#{$prefix}__knob {
                  @include themify($themes) {
                    background: themed(
                      "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.knob.active"
                    ) !important;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

.#{$prefix} {
  @include defineSizes();
  @include defineThemes();

  &__container {
    @include box(100%);
  }

  &__splitter {
    @include useThemeTransition();
  }
}
</style>
