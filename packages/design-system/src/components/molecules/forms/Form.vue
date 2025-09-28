<script setup lang="ts">
import { useId } from "vue";

import { Text } from "@/components/atoms";
import type { FormProps } from "@/components/molecules";

const PREFIX = "form";

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
      PREFIX,
      { [`${PREFIX}_variant-${variant}`]: !!variant },
      { [`${PREFIX}_size-${size}`]: !!size },
      { [`${PREFIX}_mode-${mode}`]: !!mode },
      { [`${PREFIX}_tone-${tone}`]: !!tone },
    ]"
    @submit.prevent
  >
    <div :class="`${PREFIX}__container`">
      <div
        v-if="$slots.header || title"
        :class="`${PREFIX}__header`"
        data-testid="form-header"
      >
        <Text :variant="'title-2'" :mode="'neutral'" :tone="'primary'">
          {{ title }}
        </Text>
        <slot name="header"></slot>
      </div>
      <div :class="`${PREFIX}__body`">
        <slot></slot>
      </div>
      <div v-if="$slots.footer" class="form__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </form>
</template>

<style lang="scss">
$prefix: form;

@mixin defineSizes($map: get($molecules, "#{$prefix}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $border-radius: get($val, "root.border-radius");

      $body-gap: get($val, "body.gap");
      $body-padding: get($val, "body.padding");

      &_size-#{$size} {
        border-radius: $border-radius;

        .#{$prefix}__body {
          gap: $body-gap;
        }

        .#{$prefix} {
          &__header,
          &__body,
          &__footer {
            padding: $body-padding 0;
          }
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.molecules.#{$prefix}")) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.#{$prefix}_tone-#{$tone} {
          @include themify($themes) {
            background-color: themed(
              "molecules.#{$prefix}.#{$mode}.#{$tone}.background"
            );
            @include themify($themes) {
              box-shadow: 0px 4px 32px
                themed("molecules.#{$prefix}.#{$mode}.#{$tone}.shadow");
            }
          }
        }
      }
    }
  }
}

.#{$prefix} {
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
