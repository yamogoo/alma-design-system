<script setup lang="ts">
import { useTemplateRef } from "vue";

import { type CharTooltipLabelProps } from "@/components/atoms/tooltips/CharTooltipLabel";
import Text from "@/components/atoms/typography/Text.vue";
import Icon from "@/components/atoms/icons/Icon.vue";

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

@mixin defineSized($map: get($components, "atoms.#{$prefix}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          $gap: px2rem(get($val, "root.gap"));
          $min-width: px2rem(get($val, "root.min-width"));
          $max-width: px2rem(get($val, "root.max-width"));
          $padding: get($val, "root.padding");
          $border-radius: px2rem(get($val, "root.border-radius"));
          $border-width: px2rem(get($val, "root.border-width"));

          $label-font-style: get($val, "label.font-style");

          $icon-size: get($val, "icon.size");

          gap: $gap;
          min-width: $min-width;
          max-width: $max-width;
          padding: $padding;
          border-radius: $border-radius;
          border-width: $border-width;
          border-style: solid;

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

@mixin defineThemes($map: get($themes, "light.components.atoms.#{$prefix}")) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.#{$prefix}_tone-#{$tone} {
          @include themify($themes) {
            background-color: themed(
              "components.atoms.#{$prefix}.#{$mode}.#{$tone}.root.background.normal"
            );
            border-color: themed(
              "components.atoms.#{$prefix}.#{$mode}.#{$tone}.root.border.normal"
            );

            .text {
              color: themed(
                "components.atoms.#{$prefix}.#{$mode}.#{$tone}.label.normal"
              );
            }

            .icon {
              fill: themed(
                "components.atoms.#{$prefix}.#{$mode}.#{$tone}.label.normal"
              );
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
  width: max-content;
  @extend %base-transition;

  @include defineSized();
  @include defineThemes();

  .text,
  .icon {
    @extend %base-transition;
  }
}
</style>
