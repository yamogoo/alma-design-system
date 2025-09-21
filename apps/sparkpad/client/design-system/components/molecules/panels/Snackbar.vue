<script setup lang="ts">
import { ControlButton, Text } from "@/components/atoms";
import { type SnackbarProps } from "@/components/molecules";

withDefaults(defineProps<SnackbarProps>(), {
  variant: "default",
  mode: "primary",
  tone: "neutral",
  size: "md",
  isCloseButtonShown: false,
});
</script>

<template>
  <div
    class="snackbar"
    :class="[
      `snackbar_variant-${variant}`,
      `snackbar_size-${size}`,
      `snackbar_mode-${mode}`,
      `snackbar_tone-${tone}`,
    ]"
    :role="status === 'info' ? 'status' : 'alert'"
  >
    <slot v-if="$slots.default"></slot>
    <div v-if="!$slots.default" class="snackbar__content">
      <Text v-if="title" class="snackbar__content-title"> {{ title }}</Text>
      <Text v-if="description" class="snackbar__content-description">
        {{ description }}</Text
      >
    </div>
    <ControlButton
      class="snackbar__close-button"
      :variant="'rounded'"
      :size="'xs'"
      :mode="'neutral'"
      :tone="'primary'"
      :icon-name="'cross'"
      :icon-style="'outline'"
      :icon-weight="'300'"
      :aria-label="'Close nottification'"
    ></ControlButton>
  </div>
</template>

<style lang="scss">
@use "sass:map";

@mixin defineSizes($map: get($molecules, "snackbar")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $gap: px2rem(get($val, "self.gap"));

      $padding-h: px2rem(get($val, "self.padding-h"));
      $padding-v: px2rem(get($val, "self.padding-v"));
      $padding: $padding-v $padding-h;

      $border-radius: px2rem(get($val, "self.border-radius"));

      $content-gap: px2rem(get($val, "content.gap"));
      $title-font-style: get($val, "title.font-style");
      $description-font-style: get($val, "description.font-style");

      &_variant-#{$variant} {
        &.snackbar_size-#{$size} {
          gap: $gap;
          padding: $padding;
          border-radius: $border-radius;

          .snackbar__content {
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

@mixin defineThemes($map: get($themes, "light.molecules.snackbar")) {
  @each $tone, $modes in $map {
    @each $mode, $val in $modes {
      &_tone-#{$tone} {
        $close-button-tone: get($val, "close-button.tone");
        $close-button-mode: get($val, "close-button.mode");

        /* @debug $close-button-tone $close-button-mode; */

        &.snackbar_mode-#{$mode} {
          @include themify($themes) {
            background-color: themed(
              "molecules.snackbar.#{$tone}.#{$mode}.self.background"
            );
          }

          .snackbar {
            &__content {
              &-title {
                @include themify($themes) {
                  color: themed("molecules.snackbar.#{$tone}.#{$mode}.title");
                }
              }

              &-description {
                @include themify($themes) {
                  color: themed(
                    "molecules.snackbar.#{$tone}.#{$mode}.description"
                  );
                }
              }
            }

            &__close-button {
              @extend %button_mode-#{$close-button-tone}_tone-#{$close-button-mode};
            }
          }
        }
      }
    }
  }
}

.snackbar {
  display: flex;
  @extend %base-transition;

  @include defineSizes();
  @include defineThemes();

  &__content {
    display: flex;
    flex-direction: column;
  }
}
</style>
