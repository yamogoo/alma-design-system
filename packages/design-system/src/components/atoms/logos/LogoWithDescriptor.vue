<script setup lang="ts">
import { useTemplateRef } from "vue";

import { UIFACETS, UISTATES } from "@/constants/ui";

import { useHover, usePressed } from "@/composables/local/actions";

import {
  LOGO_WITH_DESCRIPTOR_PREFIX,
  type LogoWithDescriptorProps,
} from "@/components/atoms/logos/LogoWithDescriptor";
import Logo from "@/components/atoms/logos/Logo.vue";
import Text from "@/components/atoms/typography/Text.vue";

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
  if (isPressed.value) return UISTATES.PRESSED;
  if (isHovered.value) return UISTATES.HOVERED;
  return UISTATES.NORMAL;
};
</script>

<template>
  <div
    ref="root"
    :class="[
      LOGO_WITH_DESCRIPTOR_PREFIX,
      `${LOGO_WITH_DESCRIPTOR_PREFIX}_${UIFACETS.VARIANT}-${variant}`,
      `${LOGO_WITH_DESCRIPTOR_PREFIX}_${UIFACETS.SIZE}-${size}`,
      `${LOGO_WITH_DESCRIPTOR_PREFIX}_${UIFACETS.MODE}-${mode}`,
      `${LOGO_WITH_DESCRIPTOR_PREFIX}_${UIFACETS.TONE}-${tone}`,
      `${LOGO_WITH_DESCRIPTOR_PREFIX}_${UIFACETS.STATE}-${computedClass()}`,
    ]"
  >
    <Logo data-testid="logo" />
    <Text
      :class="`${LOGO_WITH_DESCRIPTOR_PREFIX}__label`"
      :mode="'neutral'"
      :tone="'primary'"
    >
      {{ name }}
    </Text>
  </div>
</template>

<style lang="scss">
$tokenName: "logo-with-descriptor";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "atoms.#{$tokenName}")) {
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

@mixin defineThemes(
  $map: get($themes, "light.components.atoms.#{$tokenName}")
) {
  @each $mode, $val in $map {
    @each $tone, $modes in $modes {
      &_tone-#{$tone} {
        &.#{$prefix}_mode-#{$mode} {
          $states: get($themes, "light.#{$tokenName}.neutral.primary.label");

          .#{$prefix}__label {
            @include themify($themes) {
              color: themed(
                "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.label.normal"
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
