<script setup lang="ts">
import { computed, useTemplateRef } from "vue";

import { UIFACETS, UIMODIFIERS } from "@/constants/ui";

import {
  SURFACE_PREFIX,
  SurfaceBorderPositionAliases,
  SurfaceBorderPositions,
  type SurfaceProps,
} from "./Surface";
import type {
  UIElementShortPosition,
  UIElementShortPositionAlias,
} from "@/typings";

const props = withDefaults(defineProps<SurfaceProps>(), {
  as: "div",
  stretch: "fill",
  borderSides: "",
  elevated: false,
  rounded: false,
});

const root = useTemplateRef("root");

const getDirectionAlias = (
  d: UIElementShortPosition
): UIElementShortPositionAlias => {
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

    if (isPosition) {
      const className = `${SURFACE_PREFIX}_${UIMODIFIERS.BORDER}-${position}`;
      return className;
    }
  });
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
      SURFACE_PREFIX,
      {
        [`${SURFACE_PREFIX}_${UIFACETS.VARIANT}-${variant}`]: !!variant,
        [`${SURFACE_PREFIX}_${UIFACETS.SIZE}-${size}`]: !!size,
        [`${SURFACE_PREFIX}_${UIFACETS.MODE}-${mode}`]: !!mode,
        [`${SURFACE_PREFIX}_${UIFACETS.TONE}-${tone}`]: !!tone,
        [`${SURFACE_PREFIX}_${UIMODIFIERS.STRETCH}-${stretch}`]: !!stretch,
        [`${SURFACE_PREFIX}_${UIMODIFIERS.ROUNDED}`]: !!rounded,
        [`${SURFACE_PREFIX}_${UIMODIFIERS.ELEVATED}`]: !!elevated,
      },
      computedBorderClass,
    ]"
    data-testid="surface"
  >
    <slot></slot>
  </component>
</template>

<style lang="scss">
$tokenName: "surface";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "atoms.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $radius: px2rem(get($val, "root.border-radius"));
      $bwidth: px2rem(get($val, "root.border-width"));

      :where(&.#{$prefix}_variant-#{$variant}.#{$prefix}_size-#{$size}) {
        --#{$prefix}-radius: #{$radius};
        --#{$prefix}-border-width: #{$bwidth};
      }
    }
  }
}

@mixin defineThemes(
  $map: get($themes, "light.contracts.interactive.#{$tokenName}")
) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.#{$prefix}_tone-#{$tone} {
          @include defineSurfaceThemes($prefix, $mode, $tone);

          // divider
          &.#{$prefix}_divider {
            &-orientation-horizontal {
              @include themify($themes) {
                border-right-color: themed(
                  "contracts.interactive.border.#{$mode}.#{$tone}.normal"
                );
              }
            }

            &-orientation-vertical {
              @include themify($themes) {
                border-bottom-color: themed(
                  "contracts.interactive.border.#{$mode}.#{$tone}.normal"
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
  border-style: solid;
  border-width: 0;
  @include useThemeTransition();

  @include defineSizes();
  @include defineThemes();

  &_stretch {
    &-fill {
      @include box(100%);
    }

    &-auto {
      @include box(max-content);
    }
  }

  &_elevated {
    @include useElevation();
  }

  &_rounded {
    border-radius: var(--#{$prefix}-radius);
  }

  &_border {
    &-l {
      border-left-width: var(--#{$prefix}-border-width);
    }
    &-r {
      border-right-width: var(--#{$prefix}-border-width);
    }
    &-t {
      border-top-width: var(--#{$prefix}-border-width);
    }
    &-b {
      border-bottom-width: var(--#{$prefix}-border-width);
    }
  }
}
</style>
