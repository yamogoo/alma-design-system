<script setup lang="ts">
import { useTemplateRef } from "vue";

import { useHover, usePressed } from "@/composables/local";

import { type LogoWithDescriptorProps } from "@/components/atoms/logos/LogoWithDescriptor";
import Logo from "@/components/atoms/logos/Logo.vue";
import Text from "@/components/atoms/typography/Text.vue";

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
    <Text :class="`${PREFIX}__label`" :mode="'neutral'" :tone="'primary'">
      {{ name }}
    </Text>
  </div>
</template>

<style lang="scss">
$prefix: logo-with-descriptor;

@mixin defineSizes($map: get($components, "atoms.#{$prefix}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          $gap: px2rem(get($val, "root.gap"));
          $label-font-style: get($val, "label.font-style");

          gap: $gap;

          .#{$prefix}__label {
            @extend %t__#{$label-font-style};
            line-height: 1;
            margin: 0;
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
        &.#{$prefix}_mode-#{$mode} {
          $states: get($themes, "light.#{$prefix}.neutral.primary.label");

          .#{$prefix}__label {
            @include themify($themes) {
              color: themed(
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

  @include defineSizes();
}
</style>
