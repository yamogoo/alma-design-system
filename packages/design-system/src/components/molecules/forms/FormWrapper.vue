<script setup lang="ts">
import { UIFACETS } from "@/constants/ui";

import {
  FORM_WRAPPER_PREFIX,
  type FormWrapperProps,
} from "@/components/molecules/forms/FormWrapper";
import AnimatedWrapper from "@/components/atoms/containers/AnimatedWrapper.vue";
import Surface from "@/components/atoms/containers/Surface.vue";

withDefaults(defineProps<FormWrapperProps>(), {
  variant: "default",
  size: "lg",
  mode: "neutral",
  tone: "canvas",
  bordered: false,
});
</script>

<template>
  <Surface
    :class="[
      FORM_WRAPPER_PREFIX,
      {
        [`${FORM_WRAPPER_PREFIX}_${UIFACETS.VARIANT}-${variant}`]: !!variant,
        [`${FORM_WRAPPER_PREFIX}_${UIFACETS.SIZE}-${size}`]: !!size,
      },
    ]"
    :variant="variant"
    :size="size"
    :mode="mode"
    :tone="tone"
    :state="state"
    :border-sides="borderSides"
    :elevated="elevated"
    :is-container="isContainer"
    data-testid="form-wrapper"
  >
    <AnimatedWrapper :duration="duration" :content-key="contentKey ?? ''">
      <div v-if="$slots.header" :class="`${FORM_WRAPPER_PREFIX}__header`">
        <slot name="header"></slot>
      </div>
      <slot></slot>
    </AnimatedWrapper>
  </Surface>
</template>

<style lang="scss">
$tokenName: "form-wrapper";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "molecules.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $padding: get($val, "root.padding");

      $border-radius: px2rem(get($val, "root.border-radius"));
      $border-width: px2rem(get($val, "root.border-width"));

      $header-padding: get($val, "header.padding");

      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          padding: $padding;
          border-radius: $border-radius;

          .#{$prefix}__header {
            padding: $header-padding;
          }
        }
      }
    }
  }
}

.#{$prefix} {
  overflow: hidden;
  @extend %base-transition;

  @include defineSizes();
}
</style>
