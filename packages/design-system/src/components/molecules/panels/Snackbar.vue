<script setup lang="ts">
import { UIFACETS } from "@/constants/ui";

import {
  SNACKBAR_PREFIX,
  type SnackbarProps,
} from "@/components/molecules/panels/Snackbar";

import Text from "@/components/atoms/typography/Text.vue";
import ControlButton from "@/components/molecules/buttons/aliases/ControlButton.vue";

withDefaults(defineProps<SnackbarProps>(), {
  variant: "default",
  mode: "neutral",
  tone: "primary",
  size: "md",
  isCloseButtonShown: false,
});

const emit = defineEmits<{
  (e: "close"): void;
}>();

const onClose = (): void => {
  emit("close");
};
</script>

<template>
  <div
    :class="[
      SNACKBAR_PREFIX,
      `${SNACKBAR_PREFIX}_${UIFACETS.VARIANT}-${variant}`,
      `${SNACKBAR_PREFIX}_${UIFACETS.SIZE}-${size}`,
      `${SNACKBAR_PREFIX}_${UIFACETS.MODE}-${mode}`,
      `${SNACKBAR_PREFIX}_${UIFACETS.TONE}-${tone}`,
    ]"
    :role="status === 'info' ? 'status' : 'alert'"
  >
    <slot v-if="$slots.default"></slot>
    <div v-if="!$slots.default" :class="`${SNACKBAR_PREFIX}__content`">
      <Text
        v-if="title"
        :class="`${SNACKBAR_PREFIX}__content-title`"
        :data-testid="`${SNACKBAR_PREFIX}__title`"
      >
        {{ title }}</Text
      >
      <Text
        v-if="description"
        :class="`${SNACKBAR_PREFIX}__content-description`"
        :data-testid="`${SNACKBAR_PREFIX}__description`"
      >
        {{ description }}
      </Text>
    </div>
    <ControlButton
      v-if="isCloseButtonShown"
      :class="`${SNACKBAR_PREFIX}__close-button`"
      :variant="'rounded'"
      :size="'xs'"
      :mode="'neutral'"
      :tone="'primary'"
      :icon-name="'cross'"
      :icon-style="'outline'"
      :icon-weight="'300'"
      :aria-label="'Close notification'"
      @click="onClose"
    ></ControlButton>
  </div>
</template>

<style lang="scss">
$tokenName: "snackbar";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "molecules.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $gap: px2rem(get($val, "root.gap"));

      $padding-h: px2rem(get($val, "root.padding-h"));
      $padding-v: px2rem(get($val, "root.padding-v"));
      $padding: $padding-v $padding-h;

      $border-radius: px2rem(get($val, "root.border-radius"));

      $content-gap: px2rem(get($val, "content.gap"));
      $title-font-style: get($val, "title.font-style");
      $description-font-style: get($val, "description.font-style");

      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          gap: $gap;
          padding: $padding;
          border-radius: $border-radius;

          .#{$prefix}__content {
            gap: $content-gap;

            &-title {
              @extend %t__#{$title-font-style};
            }

            &-description {
              @extend %t__#{$description-font-style};
            }
          }
        }
      }
    }
  }
}

@mixin defineThemes(
  $map: get($themes, "light.components.molecules.#{$tokenName}")
) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        $close-button-mode: get($val, "close-button.mode");
        $close-button-tone: get($val, "close-button.tone");

        &.#{$prefix}_tone-#{$tone} {
          @include themify($themes) {
            background-color: themed(
              "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.root.background"
            );
          }

          .#{$prefix} {
            &__content {
              &-title {
                @include themify($themes) {
                  color: themed(
                    "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.title"
                  );
                }
              }

              &-description {
                @include themify($themes) {
                  color: themed(
                    "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.description"
                  );
                }
              }
            }

            /* &__close-button {
              @extend %button_mode-#{$close-button-tone}_tone-#{$close-button-mode};
            } */
          }
        }
      }
    }
  }
}

.#{$prefix} {
  display: flex;
  @include useThemeTransition();

  @include defineSizes();
  @include defineThemes();

  &__content {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
}
</style>
