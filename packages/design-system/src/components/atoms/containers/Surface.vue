<script setup lang="ts">
import { computed, useTemplateRef, watchEffect } from "vue";

import {
  SurfaceBorderPositionAliases,
  SurfaceBorderPositions,
  type SurfaceProps,
} from "./Surface";
import type {
  UIElementShortPositionAliases,
  UIElementShortPositions,
} from "@/typings";

const PREFIX = "surface";

const props = withDefaults(defineProps<SurfaceProps>(), {
  as: "div",
  borderSides: "rl",
  elevated: false,
  rounded: false,
});

const root = useTemplateRef("root");

const getDirectionAlias = (
  d: UIElementShortPositions
): UIElementShortPositionAliases => {
  if (d === SurfaceBorderPositions.LEFT || d === SurfaceBorderPositions.RIGHT)
    return SurfaceBorderPositionAliases.HORIZONTAL;
  return SurfaceBorderPositionAliases.VERTICAL;
};

const computedBorderClass = computed(() => {
  const sides = props.borderSides;

  return Object.values(SurfaceBorderPositions).map((position) => {
    const isPosition =
      RegExp(position).test(sides) ||
      RegExp(getDirectionAlias(position)).test(sides);

    console.log(isPosition);

    if (isPosition) {
      const className = `${PREFIX}_border-${position}`;
      return className;
    }
  });
});

watchEffect(() => {
  console.log(computedBorderClass.value);
});

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
        [`${PREFIX}_rounded`]: !!rounded,
        [`${PREFIX}_elevated`]: !!elevated,
      },
      computedBorderClass,
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

          &.#{$prefix}_rounded {
            border-radius: $border-radius;
          }

          &.#{$prefix}_border {
            &-l {
              border-left-width: $border-width;
            }

            &-r {
              border-right-width: $border-width;
            }

            &-t {
              border-top-width: $border-width;
            }

            &-b {
              border-bottom-width: $border-width;
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

  &_elevated {
    @include useElevation();
  }
}
</style>
