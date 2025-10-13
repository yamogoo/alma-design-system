<script setup lang="ts">
import { UIFACETS } from "@/constants/ui";

import {
  NAVIGATION_RAIL_PREFIX,
  type NavigationRailTemplateProps,
} from "@/components/templates/navigation/NavigationRailTemplate";

withDefaults(defineProps<NavigationRailTemplateProps>(), {
  variant: "default",
  size: "lg",
  mode: "neutral",
  tone: "primary",
});
</script>

<template>
  <div
    :class="[
      NAVIGATION_RAIL_PREFIX,
      `${NAVIGATION_RAIL_PREFIX}_${UIFACETS.VARIANT}-${variant}`,
      `${NAVIGATION_RAIL_PREFIX}_${UIFACETS.SIZE}-${size}`,
      `${NAVIGATION_RAIL_PREFIX}_${UIFACETS.MODE}-${mode}`,
      `${NAVIGATION_RAIL_PREFIX}_${UIFACETS.TONE}-${tone}`,
    ]"
    role="navigation"
    aria-label="Navigation rail"
  >
    <div v-if="$slots.header" :class="`${NAVIGATION_RAIL_PREFIX}__header`">
      <slot name="header"></slot>
    </div>
    <div v-if="$slots.default" :class="`${NAVIGATION_RAIL_PREFIX}__body`">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" :class="`${NAVIGATION_RAIL_PREFIX}__footer`">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style lang="scss">
$tokenName: "navigation-rail";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "templates.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          $gap: px2rem(get($val, "root.gap"));
          $min-width: px2rem(get($val, "root.min-width"));
          $padding-v: px2rem(get($val, "root.padding"));

          gap: $gap;
          min-width: $min-width;
          padding-top: $padding-v;
          padding-bottom: $padding-v;
        }
      }
    }
  }
}

@mixin defineThemes(
  $map: get($themes, "light.components.templates.#{$tokenName}")
) {
  @each $tone, $modes in $map {
    @each $mode, $val in $modes {
      &_tone-#{$tone} {
        &.#{$prefix}_mode-#{$mode} {
          @include themify($themes) {
            background-color: themed(
              "components.templates.#{$tokenName}.#{$tone}.#{$mode}.root.background.normal"
            );
            border: get($tokens, "outline") solid
              themed(
                "components.templates.#{$tokenName}.#{$tone}.#{$mode}.root.border.normal"
              );
          }
          @include useThemeTransition();
        }
      }
    }
  }
}

.#{$prefix} {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  @extend %main-container;

  @include defineSizes();
  @include defineThemes();
}
</style>
