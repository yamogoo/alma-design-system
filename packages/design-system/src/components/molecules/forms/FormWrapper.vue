<script setup lang="ts">
import { UIFACETS } from "@/constants/ui";

import { useFacetsClasses } from "@/composables/local/components/useFacetsClasses";

import {
  FORM_WRAPPER_PREFIX,
  type FormWrapperProps,
} from "@/components/molecules/forms/FormWrapper";
import AnimatedWrapper from "@/components/atoms/containers/AnimatedWrapper.vue";
import Surface from "@/components/atoms/containers/Surface.vue";

const props = withDefaults(defineProps<FormWrapperProps>(), {
  variant: "default",
  size: "lg",
  mode: "neutral",
  tone: "canvas",
  bordered: false,
});

const { classes: facetClasses } = useFacetsClasses({
  prefix: FORM_WRAPPER_PREFIX,
  props: props,
  facets: [UIFACETS.VARIANT, UIFACETS.SIZE],
});
</script>

<template>
  <Surface
    :class="[facetClasses]"
    :variant="variant"
    :size="size"
    :mode="mode"
    :tone="tone"
    :state="state"
    align-horizontal="start"
    align-vertical="start"
    :border="border"
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

  @include defineSizes();
}
</style>
