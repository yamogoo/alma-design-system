<script setup lang="ts" generic="T">
import { type OptionsProps } from "@/components/molecules/options/Options";
import Text from "@/components/atoms/typography/Text.vue";

const PREFIX = "options";

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
    :class="[
      PREFIX,
      {
        [`${PREFIX}_variant-${variant}`]: !!variant,
        [`${PREFIX}_size-${size}`]: !!size,
        [`${PREFIX}_mode-${mode}`]: !!mode,
        [`${PREFIX}_tone-${tone}`]: !!tone,
      },
    ]"
  >
    <template v-for="key in items" :key="key">
      <Text
        v-if="showCurrentOption(key)"
        :as="'li'"
        :class="`${PREFIX}__option`"
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
$prefix: options;

@mixin defineSizes($map: get($components, "molecules.#{$prefix}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $option-font-style: get($val, "option.font-style");
      $option-min-height: px2rem(get($val, "option.min-height"));

      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          .#{$prefix}__option {
            min-height: $option-min-height;
            @extend %t__#{$option-font-style};
          }
        }
      }
    }
  }
}

@mixin defineThemes(
  $map: get($themes, "light.components.molecules.#{$prefix}")
) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.#{$prefix}_tone-#{$tone} {
          .#{$prefix}__option {
            @include themify($themes) {
              color: themed(
                "components.molecules.#{$prefix}.#{$mode}.#{$tone}.label.normal"
              );
            }

            &:hover {
              @include themify($themes) {
                color: themed(
                  "components.molecules.#{$prefix}.#{$mode}.#{$tone}.label.hovered"
                );
              }
            }
          }
        }
      }
    }
  }
}

.#{$prefix} {
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
