<script setup lang="ts">
import { useTemplateRef } from "vue";

import { useHover, usePressed } from "@/composables/local";

import { Logo, Text, type LogoWithDescriptorProps } from "@/components/atoms";

withDefaults(defineProps<LogoWithDescriptorProps>(), {
  variant: "default",
  size: "md",
  tone: "default",
  mode: "primary",
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
    class="logo-with-descriptor"
    :class="[
      `logo-with-descriptor_variant-${variant}`,
      `logo-with-descriptor_size-${size}`,
      `logo-with-descriptor_mode-${mode}`,
      `logo-with-descriptor_tone-${tone}`,
      `logo-with-descriptor_state-${computedClass()}`,
    ]"
  >
    <Logo data-testid="logo" />
    <Text variant="body-2" class="logo-with-descriptor__label">
      {{ name }}
    </Text>
  </div>
</template>

<style lang="scss">
@mixin defineButtonSizes($map: get($atoms, "logo-with-descriptor")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.logo-with-descriptor_size-#{$size} {
          $gap: px2rem(get($val, "self.gap"));
          $label-font-style: get($val, "label.font-style");

          gap: $gap;

          &.logo-with-descriptor__label {
            @extend %t__#{$label-font-style};
            line-height: 1;
          }
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.atoms.logo-with-descriptor")) {
  @each $tone, $modes in $map {
    @each $mode, $val in $modes {
      &_tone-#{$tone} {
        &.logo-with-descriptor_mode-#{$mode} {
          $states: get(
            $themes,
            "light.logo-with-descriptor.default.primary.label"
          );

          &.logo-with-descriptor {
            @each $state in $states {
              &._state-#{$state} {
                .logo-with-descriptor__label {
                  @include themify($themes) {
                    color: themed(
                      "logo-with-descriptor.#{$tone}.#{$mode}.label.#{state}"
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

.logo-with-descriptor {
  display: flex;
  flex-direction: row;
  align-items: center;

  @include defineButtonSizes();
}
</style>
