<script setup lang="ts">
import { useId } from "vue";

import { Text } from "@/components/atoms";
import type { FormProps } from "@/components/molecules";

withDefaults(defineProps<FormProps>(), {
  variant: "default",
  size: "md",
  mode: "primary",
});

const id = useId();
</script>

<template>
  <form
    :id
    class="form"
    :class="[
      { [`form_variant-${variant}`]: !!variant },
      { [`form_size-${size}`]: !!size },
      { [`form_mode-${mode}`]: !!mode },
    ]"
    @submit.prevent
  >
    <div class="form__container">
      <div
        v-if="$slots.header || title"
        class="form__header"
        data-testid="form-header"
      >
        <Text :variant="'title-2'" :mode="'neutral'" :tone="'primary'">{{
          title
        }}</Text>
        <slot name="header"></slot>
      </div>
      <div class="form__body">
        <slot></slot>
      </div>
      <div v-if="$slots.footer" class="form__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </form>
</template>

<style lang="scss">
@use "sass:map";

@mixin defineSizes($map: get($molecules, "form")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $border-radius: get($val, "root.border-radius");

      $body-gap: get($val, "body.gap");
      $body-padding: get($val, "body.padding");

      &_size-#{$size} {
        border-radius: $border-radius;

        .form__body {
          gap: $body-gap;
        }

        .form__header,
        .form__body,
        .form__footer {
          padding: $body-padding 0;
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.molecules.form")) {
  @each $mode, $modes in $map {
    &_mode-#{$mode} {
      @include themify($themes) {
        background-color: themed("molecules.form.#{$mode}.background");
        @include themify($themes) {
          box-shadow: 0px 4px 32px themed("molecules.form.#{$mode}.shadow");
        }
      }
    }
  }
}

.form {
  width: 100%;
  @extend %base-transition;

  @include defineSizes();
  @include defineThemes();

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
