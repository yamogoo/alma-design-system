<script setup lang="ts">
import type { NavigationRailTemplateProps } from "@/components/templates";

withDefaults(defineProps<NavigationRailTemplateProps>(), {
  variant: "default",
  size: "lg",
  mode: "primary",
  tone: "neutral",
});
</script>

<template>
  <div
    class="navigation-rail"
    :class="[
      `navigation-rail_variant-${variant}`,
      `navigation-rail_size-${size}`,
      `navigation-rail_mode-${mode}`,
      `navigation-rail_tone-${tone}`,
    ]"
    role="navigation"
    aria-label="Navigation rail"
  >
    <div v-if="$slots.header" class="navigation-rail__header">
      <slot name="header"></slot>
    </div>
    <div v-if="$slots.default" class="navigation-rail__body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="navigation-rail__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style lang="scss">
$prefix: navigation-rail;

@mixin defineSizes($map: get($templates, "#{$prefix}")) {
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

@mixin defineThemes($map: get($themes, "light.templates.#{$prefix}")) {
  @each $tone, $modes in $map {
    @each $mode, $val in $modes {
      &_tone-#{$tone} {
        &.#{$prefix}_mode-#{$mode} {
          @include themify($themes) {
            background-color: themed(
              "templates.#{$prefix}.#{$tone}.#{$mode}.root.background.normal"
            );
            border: $outline solid
              themed(
                "templates.#{$prefix}.#{$tone}.#{$mode}.root.border.normal"
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
