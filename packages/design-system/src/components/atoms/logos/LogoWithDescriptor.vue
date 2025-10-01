<script setup lang="ts">
import { useTemplateRef } from "vue";

import { useHover, usePressed } from "@/composables/local";

import { Logo, Text, type LogoWithDescriptorProps } from "@/components/atoms";

const PREFIX = "logo-with-descriptor";

withDefaults(defineProps<LogoWithDescriptorProps>(), {
  variant: "default",
  size: "md",
  mode: "neutral",
  tone: "primary",
});

const root = useTemplateRef<HTMLElement | null>("root");

const { isHovered } = useHover(root);
const { isPressed } = usePressed(root);

const computedClass = () => {
  if (isPressed.value) return "pressed";
  if (isHovered.value) return "hovered";
  return "normal";
};
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
      `${PREFIX}_state-${computedClass()}`,
    ]"
  >
    <Logo data-testid="logo" />
    <Text variant="body-2" :class="`${PREFIX}__label`">
      {{ name }}
    </Text>
  </div>
</template>

<style lang="scss">
$prefix: logo-with-descriptor;

@mixin defineButtonSizes($map: get($components, "atoms.#{$prefix}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          $gap: px2rem(get($val, "root.gap"));
          $label-font-style: get($val, "label.font-style");

          gap: $gap;

          &.#{$prefix}__label {
            @extend %t__#{$label-font-style};
            line-height: 1;
          }
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.components.atoms.#{$prefix}")) {
  @each $mode, $val in $map {
    @each $tone, $modes in $modes {
      &_tone-#{$tone} {
        &.logo-with-descriptor_mode-#{$mode} {
          $states: get($themes, "light.#{$prefix}.neutral.primary.label");

          &.#{$prefix} {
            @each $state in $states {
              &._state-#{$state} {
                .#{$prefix}__label {
                  @include themify($themes) {
                    color: themed(
                      "#{$prefix}.#{$mode}.#{$tone}.label.#{state}"
                    );
                  }
                }
              }
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

  @include defineButtonSizes();
}
</style>
