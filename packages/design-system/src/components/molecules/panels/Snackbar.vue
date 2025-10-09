<script setup lang="ts">
import { type SnackbarProps } from "@/components/molecules/panels/Snackbar";
import Text from "@/components/atoms/typography/Text.vue";
import ControlButton from "@/components/atoms/buttons/ControlButton.vue";

const PREFIX = "snackbar";

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
      PREFIX,
      `${PREFIX}_variant-${variant}`,
      `${PREFIX}_size-${size}`,
      `${PREFIX}_mode-${mode}`,
      `${PREFIX}_tone-${tone}`,
    ]"
    :role="status === 'info' ? 'status' : 'alert'"
  >
    <slot v-if="$slots.default"></slot>
    <div v-if="!$slots.default" :class="`${PREFIX}__content`">
      <Text v-if="title" :class="`${PREFIX}__content-title`"> {{ title }}</Text>
      <Text v-if="description" :class="`${PREFIX}__content-description`">
        {{ description }}
      </Text>
    </div>
    <ControlButton
      v-if="isCloseButtonShown"
      :class="`${PREFIX}__close-button`"
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
$prefix: snackbar;

@mixin defineSizes($map: get($components, "molecules.#{$prefix}")) {
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
  $map: get($themes, "light.components.molecules.#{$prefix}")
) {
  @each $tone, $modes in $map {
    @each $mode, $val in $modes {
      &_tone-#{$tone} {
        $close-button-tone: get($val, "close-button.tone");
        $close-button-mode: get($val, "close-button.mode");

        &.#{$prefix}_mode-#{$mode} {
          @include themify($themes) {
            background-color: themed(
              "components.molecules.#{$prefix}.#{$tone}.#{$mode}.root.background"
            );
          }

          .#{$prefix} {
            &__content {
              &-title {
                @include themify($themes) {
                  color: themed(
                    "components.molecules.#{$prefix}.#{$tone}.#{$mode}.title"
                  );
                }
              }

              &-description {
                @include themify($themes) {
                  color: themed(
                    "components.molecules.#{$prefix}.#{$tone}.#{$mode}.description"
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
