<script setup lang="ts">
import { AnimatedWrapper } from "@/components/atoms";
import type { FormWrapperProps } from "@/components/molecules";
import Surface from "@/components/atoms/containers/Surface.vue";

const PREFIX = "form-wrapper";

withDefaults(defineProps<FormWrapperProps>(), {
  variant: "default",
  size: "lg",
  mode: "neutral",
  tone: "main",
  bordered: false,
});
</script>

<template>
  <Surface
    :class="[
      PREFIX,
      `${PREFIX}_variant-${variant}`,
      `${PREFIX}_size-${size}`,
      `${PREFIX}_mode-${mode}`,
      `${PREFIX}_tone-${tone}`,
      { [`${PREFIX}_bordered`]: bordered },
    ]"
    :variant="variant"
    :size="size"
    :mode="mode"
    :tone="tone"
    data-testid="form-wrapper"
  >
    <AnimatedWrapper :duration="duration" :content-key="contentKey ?? ''">
      <div v-if="$slots.header" :class="`${PREFIX}__header`">
        <slot name="header"></slot>
      </div>
      <slot></slot>
    </AnimatedWrapper>
  </Surface>
</template>

<style lang="scss">
$prefix: form-wrapper;

@mixin defineSizes($map: get($components, "molecules.#{$prefix}")) {
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

          &.#{$prefix}_bordered {
            border-style: solid;
            border-width: $border-width;
          }

          .#{$prefix}__header {
            padding: $header-padding;
          }
        }
      }
    }
  }
}

@mixin defineThemes(
  $map: get($themes, "light.components.molecules.#{$prefix}")
) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.#{$prefix}_tone-#{$tone} {
          @include themify($themes) {
            background-color: themed(
              "components.molecules.#{$prefix}.#{$mode}.#{$tone}.background"
            );
            border-color: themed(
              "components.molecules.#{$prefix}.#{$mode}.#{$tone}.border"
            );
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
  @include defineThemes();
}
</style>
