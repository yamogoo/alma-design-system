<script setup lang="ts">
import { UIFACETS } from "@/constants/ui";

import {
  MAIN_HEADER_PREFIX,
  type MainHeaderProps,
} from "@/components/templates/headers/MainHeaderTemplate";

withDefaults(defineProps<MainHeaderProps>(), {
  as: "header",
  variant: "default",
  size: "md",
  isMainElement: true,
});
</script>

<template>
  <component
    :is="as"
    :class="[
      MAIN_HEADER_PREFIX,
      `${MAIN_HEADER_PREFIX}_${UIFACETS.VARIANT}-${variant}`,
      `${MAIN_HEADER_PREFIX}_${UIFACETS.SIZE}-${size}`,
      `${MAIN_HEADER_PREFIX}_${UIFACETS.MODE}-${mode}`,
      `${MAIN_HEADER_PREFIX}_${UIFACETS.TONE}-${tone}`,
    ]"
    :role="isMainElement ? undefined : 'banner'"
  >
    <div :class="`${MAIN_HEADER_PREFIX}__section-left`">
      <slot name="left"></slot>
    </div>
    <div :class="`${MAIN_HEADER_PREFIX}__section-content`">
      <slot></slot>
    </div>
    <div :class="`${MAIN_HEADER_PREFIX}__section-right`">
      <slot name="right"></slot>
    </div>
  </component>
</template>

<style lang="scss">
$tokenName: "main-header";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "templates.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          $padding: px2rem(get($val, "root.padding"));

          padding-top: $padding;
          padding-bottom: $padding;
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
          @extend %base-transition;
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
