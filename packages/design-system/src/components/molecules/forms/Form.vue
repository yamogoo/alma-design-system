<script setup lang="ts">
import { useId } from "vue";

import { UIFACETS } from "@/constants/ui";

import { FORM_PREFIX, type FormProps } from "@/components/molecules/forms/Form";
import Text from "@/components/atoms/typography/Text.vue";

withDefaults(defineProps<FormProps>(), {
  variant: "default",
  size: "md",
  mode: "neutral",
  tone: "primary",
});

const id = useId();
</script>

<template>
  <form
    :id
    :class="[
      FORM_PREFIX,
      { [`${FORM_PREFIX}_${UIFACETS.VARIANT}-${variant}`]: !!variant },
      { [`${FORM_PREFIX}_${UIFACETS.SIZE}-${size}`]: !!size },
    ]"
    @submit.prevent
  >
    <div :class="`${FORM_PREFIX}__container`">
      <div
        v-if="$slots.header || title"
        :class="`${FORM_PREFIX}__header`"
        data-testid="form-header"
      >
        <Text :variant="'title-1'" :mode="'neutral'" :tone="'primary'">
          {{ title }}
        </Text>
        <slot name="header"></slot>
      </div>
      <div :class="`${FORM_PREFIX}__body`">
        <slot></slot>
      </div>
      <div v-if="$slots.footer" :class="`${FORM_PREFIX}__footer`">
        <slot name="footer"></slot>
      </div>
    </div>
  </form>
</template>

<style lang="scss">
$tokenName: "form";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "molecules.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $border-radius: get($val, "root.border-radius");

      $body-gap: get($val, "body.gap");
      $body-padding: get($val, "body.padding");

      $footer-padding-top: get($val, "footer.padding-top");
      $footer-padding-bottom: get($val, "footer.padding-bottom");

      &_size-#{$size} {
        border-radius: $border-radius;

        .#{$prefix}__body {
          gap: $body-gap;
        }

        .#{$prefix} {
          &__header,
          &__body {
            padding: $body-padding 0;
          }

          &__footer {
            padding-top: $footer-padding-top;
            padding-bottom: $footer-padding-bottom;
          }
        }
      }
    }
  }
}

.#{$prefix} {
  width: 100%;
  @include useThemeTransition();

  @include defineSizes();

  &__container {
    @include transition(height, 250ms, ease-in-out);
  }

  &__header,
  &__footer {
    display: flex;
    justify-content: center;
  }

  &__body {
    display: flex;
    flex-direction: column;
  }
}
</style>
