<script setup lang="ts">
import { UIFACETS } from "@/constants/ui";

import {
  MAIN_FOOTER_PREFIX,
  type MainFooterProps,
} from "@/components/templates/footers/MainFooterTemplate";

withDefaults(defineProps<MainFooterProps>(), {
  as: "footer",
});
</script>

<template>
  <component
    :is="as"
    :class="[
      MAIN_FOOTER_PREFIX,
      `${MAIN_FOOTER_PREFIX}_${UIFACETS.VARIANT}-${variant}`,
      `${MAIN_FOOTER_PREFIX}_${UIFACETS.SIZE}-${size}`,
      `${MAIN_FOOTER_PREFIX}_${UIFACETS.MODE}-${mode}`,
      `${MAIN_FOOTER_PREFIX}_${UIFACETS.TONE}-${tone}`,
    ]"
  >
    <div v-if="$slots.left" :class="`${MAIN_FOOTER_PREFIX}__section-left`">
      <slot name="left"></slot>
    </div>
    <div
      v-if="$slots.default"
      :class="`${MAIN_FOOTER_PREFIX}__section-content`"
    >
      <slot></slot>
    </div>
    <div v-if="$slots.right" :class="`${MAIN_FOOTER_PREFIX}__section-right`">
      <slot name="right"></slot>
    </div>
  </component>
</template>

<style lang="scss">
$tokenName: "main-footer";
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
  align-items: center;
  justify-content: center;
  width: 100%;
  @extend %main-container;

  @include defineSizes();
  @include defineThemes();
}
</style>
