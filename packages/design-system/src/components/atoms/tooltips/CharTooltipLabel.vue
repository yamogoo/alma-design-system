<script setup lang="ts">
import { useTemplateRef } from "vue";

import { Icon, Text, type CharTooltipLabelProps } from "@/components/atoms";

const PREFIX = "char-tooltip-label";

withDefaults(defineProps<CharTooltipLabelProps>(), {
  variant: "default",
  size: "lg",
  mode: "neutral",
  tone: "primary",
  iconStyle: "outline",
  iconWeight: "300",
});

const root = useTemplateRef("root");

defineExpose({
  root,
});
</script>

<template>
  <div
    ref="root"
    :class="[
      PREFIX,
      `${PREFIX}_variant-${variant}`,
      `${PREFIX}_size-${size}`,
      `${PREFIX}_mode-${mode}`,
      `${PREFIX}_tone-${tone}`,
    ]"
  >
    <Icon
      v-if="iconName"
      :name="iconName"
      :appearance="iconStyle"
      :weight="iconWeight"
      :size="iconSize"
      data-testid="icon"
    ></Icon>
    <Text>
      {{ label }}
    </Text>
  </div>
</template>

<style lang="scss">
$prefix: char-tooltip-label;

@mixin defineSized($map: get($atoms, "#{$prefix}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          $gap: px2rem(get($val, "root.gap"));
          $min-width: px2rem(get($val, "root.min-width"));
          $padding: get($val, "root.padding");
          $border-radius: px2rem(get($val, "root.border-radius"));

          $label-font-style: get($val, "label.font-style");

          $icon-size: get($val, "icon.size");

          gap: $gap;
          padding: $padding;
          border-radius: $border-radius;

          .text {
            @extend %t__#{$label-font-style};
          }

          .icon {
            @include box($icon-size);
          }
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.atoms.#{$prefix}")) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.#{$prefix}_tone-#{$tone} {
          @include themify($themes) {
            background-color: themed(
              "atoms.#{$prefix}.#{$mode}.#{$tone}.root.background.normal"
            );

            .text {
              color: themed("atoms.#{$prefix}.#{$mode}.#{$tone}.label.normal");
            }

            .icon {
              fill: themed("atoms.#{$prefix}.#{$mode}.#{$tone}.label.normal");
            }
          }
        }
      }
    }
  }
}

.#{$prefix} {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: min-content;
  @extend %base-transition;

  @include defineSized();
  @include defineThemes();

  .text,
  .icon {
    @extend %base-transition;
  }
}
</style>
