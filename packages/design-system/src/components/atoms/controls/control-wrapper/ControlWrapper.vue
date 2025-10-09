<script setup lang="ts">
import { PREFIX, type ControlWrapperProps } from "./ControlWrapper";

withDefaults(defineProps<ControlWrapperProps>(), {
  variant: "default",
  size: "md",
});
</script>

<template>
  <div
    :class="[
      PREFIX,
      {
        [`${PREFIX}_variant-${variant}`]: !!variant,
        [`${PREFIX}_size-${size}`]: !!size,
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
        &.control-wrapper_size-#{$size} {
          gap: $gap;
          padding: $padding;
        }
      }
    }
  }
}

.control-wrapper {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: max-content;

  @include defineButtonSizes();
}
</style>
