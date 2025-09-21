<script setup lang="ts" generic="T">
import { Text, type OptionsProps } from "@/components/atoms";

const props = withDefaults(defineProps<OptionsProps<T>>(), {
  variant: "default",
  isCurrentOptionShown: false,
});

const emit = defineEmits<{
  (e: "select", option: T): void;
}>();

const onSelect = (option: T): void => {
  emit("select", option);
};

const showCurrentOption = (key: T) => {
  if (!props.isCurrentOptionShown) {
    return key !== props.value;
  }

  return true;
};
</script>

<template>
  <ul
    class="options"
    :class="[
      {
        [`options_variant-${variant}`]: !!variant,
        [`options_size-${size}`]: !!size,
        [`options_mode-${mode}`]: !!mode,
      },
    ]"
  >
    <template v-for="key in items" :key="key">
      <Text
        v-if="showCurrentOption(key)"
        :as="'li'"
        class="options__option"
        data-testid="options__option"
        @click="onSelect(key)"
      >
        {{ `${typeof key === "string" && !$slots.default ? key : ""}` }}
        <slot :value="key"></slot>
      </Text>
    </template>
  </ul>
</template>

<style lang="scss">
@use "sass:map";

@mixin defineSizes($map: get($atoms, "options")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $option-font-style: get($val, "option.font-style");
      $option-min-height: px2rem(get($val, "option.min-height"));

      &_variant-#{$variant} {
        &.options_size-#{$size} {
          .options__option {
            min-height: $option-min-height;
            @extend %t__#{$option-font-style};
          }
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.atoms.options")) {
  @each $mode, $modes in $map {
    &_mode-#{$mode} {
      .options__option {
        @include themify($themes) {
          color: themed("atoms.options.#{$mode}.label.normal");
        }

        &:hover {
          @include themify($themes) {
            color: themed("atoms.options.#{$mode}.label.hovered");
          }
        }
      }
    }
  }
}

.options {
  margin: 0;
  padding: 0;

  @include defineSizes();
  @include defineThemes();

  &__option {
    list-style: none;
    cursor: pointer;
    @extend %base-transition;
  }
}
</style>
