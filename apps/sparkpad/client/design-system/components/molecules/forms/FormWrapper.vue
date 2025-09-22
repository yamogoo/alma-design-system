<script setup lang="ts">
import { AnimatedWrapper } from "@/components/atoms";
import type { FormWrapperProps } from "@/components/molecules";

withDefaults(defineProps<FormWrapperProps>(), {
  variant: "default",
  size: "lg",
  mode: "primary",
  bordered: false,
});
</script>

<template>
  <div
    class="form-wrapper"
    :class="[
      `form-wrapper_variant-${variant}`,
      `form-wrapper_size-${size}`,
      `form-wrapper_mode-${mode}`,

      { 'form-wrapper_bordered': bordered },
    ]"
    data-testid="form-wrapper"
  >
    <AnimatedWrapper :duration="duration" :content-key="contentKey ?? ''">
      <div v-if="$slots.header" class="form-wrapper__header">
        <slot name="header"></slot>
      </div>
      <slot></slot>
    </AnimatedWrapper>
  </div>
</template>

<style lang="scss">
@use "sass:map";

@mixin defineSizes($map: get($molecules, "form-wrapper")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $padding: get($val, "root.padding");

      $border-radius: px2rem(get($val, "root.border-radius"));
      $border-width: px2rem(get($val, "root.border-width"));

      $header-padding: get($val, "header.padding");

      &_variant-#{$variant} {
        &.form-wrapper_size-#{$size} {
          padding: $padding;
          border-radius: $border-radius;

          &.form-wrapper_bordered {
            border-style: solid;
            border-width: $border-width;
          }

          .form-wrapper__header {
            padding: $header-padding;
          }
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.molecules.form-wrapper")) {
  @each $mode, $modes in $map {
    &_mode-#{$mode} {
      @include themify($themes) {
        background-color: themed("molecules.form-wrapper.#{$mode}.background");
        border-color: themed("molecules.form-wrapper.#{$mode}.border");
      }
    }
  }
}

.form-wrapper {
  overflow: hidden;
  @extend %base-transition;

  @include defineSizes();
  @include defineThemes();
}
</style>
