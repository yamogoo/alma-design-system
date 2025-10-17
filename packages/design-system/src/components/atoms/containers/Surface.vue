<script setup lang="ts">
import { computed, ref } from "vue";

import { UIFACETS, UIMODIFIERS } from "@/constants/ui";

import { useFacetsClasses } from "@/composables/local/components/useFacetsClasses";

import type {
  UIElementShortPosition,
  UIElementShortPositionAlias,
} from "@/typings";

import {
  SURFACE_PREFIX,
  SurfaceBorderPositionAliases,
  SurfaceBorderPositions,
  type SurfaceProps,
} from "./Surface";
import Stack from "./Stack.vue";

const props = withDefaults(defineProps<SurfaceProps>(), {
  as: "div",
  stretch: "fill",
  border: "",
  elevated: false,
  rounded: false,
});

const root = ref<InstanceType<typeof Stack> | null>(null);

const { classes: facetClasses } = useFacetsClasses({
  prefix: SURFACE_PREFIX,
  props: props,
  facets: [UIFACETS.MODE, UIFACETS.TONE],
  modifiers: [UIMODIFIERS.ELEVATED, UIMODIFIERS.BORDER],
});

const getDirectionAlias = (
  d: UIElementShortPosition
): UIElementShortPositionAlias => {
  if (d === SurfaceBorderPositions.LEFT || d === SurfaceBorderPositions.RIGHT)
    return SurfaceBorderPositionAliases.HORIZONTAL;
  return SurfaceBorderPositionAliases.VERTICAL;
};

const borderClass = computed(() => {
  const sides = props.border;

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
  <Stack
    :as="as"
    ref="root"
    :class="[facetClasses, borderClass]"
    :variant="variant"
    :size="size"
    :align-horizontal="alignHorizontal"
    :align-vertical="alignVertical"
    :orientation="orientation"
    :direction="direction"
    :stretch="stretch"
    :wrap="wrap"
    :bordered="bordered"
    :divider="divider"
    :rounded="rounded"
    data-testid="surface"
  >
    <slot></slot>
  </Stack>
</template>

<style lang="scss">
$tokenName: "surface";
$prefix: getPrefix($tokenName);

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
  @include useThemeTransition();

  @include defineThemes();

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
