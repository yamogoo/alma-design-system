<script setup lang="ts">
import { useTemplateRef } from "vue";

import { Icon, Text, type CharTooltipLabelProps } from "@/components/atoms";

withDefaults(defineProps<CharTooltipLabelProps>(), {
  variant: "default",
  size: "lg",
  mode: "primary",
  iconStyle: "outline",
  iconWeight: "300",
});

const root = useTemplateRef("refRoot");

defineExpose({
  root,
});
</script>

<template>
  <div
    ref="refRoot"
    class="char-tooltip-label"
    :class="[
      `char-tooltip-label_variant-${variant}`,
      `char-tooltip-label_size-${size}`,
      `char-tooltip-label_mode-${mode}`,
    ]"
  >
    <Icon
      v-if="iconName"
      :name="iconName"
      :appearance="iconStyle"
      :weight="iconWeight"
      data-testid="icon"
    ></Icon>
    <Text>
      {{ label }}
    </Text>
    <!-- <Icon :name="'cross'" :style="'outline'" :weight="'300'"></Icon> -->
  </div>
</template>

<style lang="scss">
@use "sass:map";

@mixin defineSized($map: get($atoms, "char-tooltip-label")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.char-tooltip-label_size-#{$size} {
          $gap: px2rem(get($val, "root.gap"));
          $padding: get($val, "root.padding");
          $border-radius: px2rem(get($val, "root.border-radius"));

          $label-font-style: get($val, "label.font-style");

          gap: $gap;
          padding: $padding;
          border-radius: $border-radius;

          .text {
            @extend %t__#{$label-font-style};
          }
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.atoms.char-tooltip-label")) {
  @each $mode, $modes in $map {
    &_mode-#{$mode} {
      @include themify($themes) {
        color: themed("atoms.char-tooltip-label.#{$mode}.label.normal");
        fill: themed("atoms.char-tooltip-label.#{$mode}.label.normal");
        background-color: themed(
          "atoms.char-tooltip-label.#{$mode}.root.background.normal"
        );

        .text {
          color: inherit;
        }

        .icon {
          fill: inherit;
        }
      }
      @extend %base-transition;
    }
  }
}

.char-tooltip-label {
  display: flex;
  flex-direction: column;

  @include defineSized();
  @include defineThemes();
}
</style>
