<script setup lang="ts">
import { computed, useTemplateRef } from "vue";

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
  stretch: "fill",
  borderSides: "",
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

    if (isPosition) {
      const className = `${PREFIX}_border-${position}`;
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
      PREFIX,
      {
        [`${PREFIX}_variant-${variant}`]: !!variant,
        [`${PREFIX}_size-${size}`]: !!size,
        [`${PREFIX}_mode-${mode}`]: !!mode,
        [`${PREFIX}_tone-${tone}`]: !!tone,
        [`${PREFIX}_stretch-${stretch}`]: !!stretch,
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
      $radius: px2rem(get($val, "root.border-radius"));
      $bwidth: px2rem(get($val, "root.border-width"));

      :where(&.#{$prefix}_variant-#{$variant}.#{$prefix}_size-#{$size}) {
        --#{$prefix}-radius: #{$radius};
        --#{$prefix}-b-width: #{$bwidth};
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
          &.#{$prefix}_divider {
            &-orientation-horizontal {
              @include themify($themes) {
                border-right-color: themed(
                  "components.atoms.#{$prefix}.#{$mode}.#{$tone}.root.divider"
                );
              }
            }

            &-orientation-vertical {
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
  border-style: solid;
  border-width: 0;
  @extend %base-transition;

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
      border-left-width: var(--#{$prefix}-b-width);
    }
    &-r {
      border-right-width: var(--#{$prefix}-b-width);
    }
    &-t {
      border-top-width: var(--#{$prefix}-b-width);
    }
    &-b {
      border-bottom-width: var(--#{$prefix}-b-width);
    }
  }
}
</style>
