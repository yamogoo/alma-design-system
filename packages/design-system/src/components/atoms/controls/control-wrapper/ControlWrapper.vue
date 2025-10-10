<script setup lang="ts">
import {
  CONTROL_WRAPPER_PREFIX,
  type ControlWrapperProps,
} from "./ControlWrapper";

withDefaults(defineProps<ControlWrapperProps>(), {
  variant: "default",
  size: "md",
});
</script>

<template>
  <div
    :class="[
      CONTROL_WRAPPER_PREFIX,
      {
        [`${CONTROL_WRAPPER_PREFIX}_variant-${variant}`]: !!variant,
        [`${CONTROL_WRAPPER_PREFIX}_size-${size}`]: !!size,
      },
    ]"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss">
$tokenName: "control-wrapper";
$prefix: getPrefix($tokenName);

@mixin defineButtonSizes($map: get($components, "atoms.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $gap: px2rem(get($val, "root.gap"));
      $padding-v: px2rem(get($val, "root.padding-v"));
      $padding-h: px2rem(get($val, "root.padding-h"));
      $padding: $padding-v $padding-h;

      &_variant-#{$variant} {
        &.#{$prefix} _size-#{$size} {
          gap: $gap;
          padding: $padding;
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
  align-items: center;
  width: max-content;

  @include defineButtonSizes();
}
</style>
