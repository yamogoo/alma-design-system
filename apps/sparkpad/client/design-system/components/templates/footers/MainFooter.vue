<script setup lang="ts">
import type { MainFooterProps } from "@/components/templates";

withDefaults(defineProps<MainFooterProps>(), {
  as: "footer",
});
</script>

<template>
  <component
    :is="as"
    class="main-footer"
    :class="[
      `main-footer_variant-${variant}`,
      `main-footer_size-${size}`,
      `main-footer_mode-${mode}`,
      `main-footer_tone-${tone}`,
    ]"
  >
    <div v-if="$slots.left" class="main-footer__section-left">
      <slot name="left"></slot>
    </div>
    <div v-if="$slots.default" class="main-footer__section-content">
      <slot></slot>
    </div>
    <div v-if="$slots.right" class="main-footer__section-right">
      <slot name="right"></slot>
    </div>
  </component>
</template>

<style lang="scss">
@mixin defineSizes($map: get($templates, "main-footer")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.main-footer_size-#{$size} {
          $padding-v: px2rem(get($val, "root.padding"));
          padding-top: $padding-v;
          padding-bottom: $padding-v;
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.templates.main-footer")) {
  @each $tone, $modes in $map {
    @each $mode, $val in $modes {
      &_tone-#{$tone} {
        &.main-footer_mode-#{$mode} {
          @include themify($themes) {
            background-color: themed(
              "templates.main-footer.#{$tone}.#{$mode}.root.background.normal"
            );
            border: $outline solid
              themed(
                "templates.main-footer.#{$tone}.#{$mode}.root.border.normal"
              );
          }
          @extend %base-transition;
        }
      }
    }
  }
}

.main-footer {
  $padding-v: px2rem(get($spacing, "sm"));

  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  @extend %main-container;
  padding-top: $padding-v;
  padding-bottom: $padding-v;

  @include defineSizes();
  @include defineThemes();
}
</style>
