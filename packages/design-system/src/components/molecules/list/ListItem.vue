<script setup lang="ts">
import { computed, inject, useSlots } from "vue";
import type { ListItemProps } from "./ListItem";

import { ListInjectionKey, type ListInjection } from "./List";

import Text from "@/components/atoms/typography/Text.vue";
import Icon from "@/components/atoms/icons/Icon.vue";

const PREFIX = "list-item";

const props = withDefaults(defineProps<ListItemProps>(), {
  as: "div",
  variant: "default",
  size: "md",
  mode: "neutral",
  tone: "primary",
  iconStyle: "outline",
  iconWeight: "400",
  isJoined: true,
  isSelectOnRelease: true,
  isDisabled: false,
});

const slots = useSlots();

const emit = defineEmits<{
  (e: "press", ev: PointerEvent): void;
  (e: "select"): void;
}>();

const ctx = inject<ListInjection | null>(ListInjectionKey, null);

const hasUserContent = computed(() => {
  const s = slots.default?.();
  return !!(s && s.length);
});

const isSelected = computed(() => {
  if (!ctx?.selectedItemId) return false;
  const sel = ctx.selectedItemId.value as
    | ListItemProps["id"]
    | ListItemProps["id"][]
    | null;
  return Array.isArray(sel) ? sel.includes(props.id) : sel === props.id;
});

const isCurrentItemShown = computed(() => {
  return !!ctx?.isCurrentItemShown?.value;
});

const onPress = (e: PointerEvent, isPressed: boolean): void => {
  if (props.isDisabled) return;
  if (ctx?.isSelectable && ctx.isSelectable.value === false) return;
  if (props.isSelectOnRelease) {
    if (isPressed) return;
  } else {
    if (!isPressed) return;
  }

  e.preventDefault();

  if (ctx?.selectedItemId) ctx.setSelectedItemId(props.id);
  emit("press", e);
};
</script>

<template>
  <component
    :is="as"
    :class="[
      PREFIX,
      {
        [`${PREFIX}_variant-${variant}`]: !!variant,
        [`${PREFIX}_size-${size}`]: !!size,
        [`${PREFIX}_mode-${mode}`]: !!mode,
        [`${PREFIX}_tone-${tone}`]: !!tone,
      },
      `${PREFIX}_state-${isSelected ? 'selected' : 'normal'}`,
      { [`${PREFIX}_joined`]: isJoined },
      { [`${PREFIX}_divider`]: divider },
    ]"
    role="listitem"
    tabindex="-1"
    :aria-current="isCurrentItemShown && isSelected ? true : undefined"
    @pointerdown="(e: PointerEvent) => onPress(e, true)"
    @pointerup="(e: PointerEvent) => onPress(e, false)"
  >
    <div class="list-item__container">
      <slot name="prepend">
        <Icon
          v-if="iconName"
          :name="iconName"
          :appearance="iconStyle"
          :weight="iconWeight"
          :size="iconSize"
        ></Icon>
      </slot>
      <slot v-if="hasUserContent"></slot>
      <template v-else>
        <div class="list-item__content">
          <Text
            v-if="title"
            :class="`${PREFIX}__title`"
            :data-testid="`${PREFIX}-title`"
          >
            {{ title }}
          </Text>
          <Text
            v-if="description"
            :class="`${PREFIX}__description`"
            :data-testid="`${PREFIX}-description`"
          >
            {{ description }}
          </Text>
        </div>
      </template>
      <slot name="append">
        <Icon
          :class="`${PREFIX}__chevron`"
          :name="'right'"
          :appearance="'outline'"
          :weight="'300'"
          :size="iconSize"
        ></Icon>
      </slot>
    </div>
  </component>
</template>

<style lang="scss">
$prefix: list-item;

@mixin defineSizes($map: get($components, "molecules.#{$prefix}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          $min-height: px2rem(get($val, "root.min-height"));
          $padding-horizontal: px2rem(get($val, "root.padding-horizontal"));
          $padding-vertical: px2rem(get($val, "root.padding-vertical"));
          $border-radius: px2rem(get($val, "root.border-radius"));
          $border-width: px2rem(get($val, "root.border-width"));

          $container-border-width: px2rem(get($val, "root.border-width"));

          $title-font-style: get($val, "title.font-style");
          $description-font-style: get($val, "description.font-style");

          $chevron-size: px2rem(get($val, "chevron.size"));

          &.#{$prefix} {
            min-height: $min-height;
            padding: 0 $padding-horizontal;

            .#{$prefix}__container {
              padding: $padding-vertical 0;
            }

            &_joined {
              // border
              &:first-child {
                border-radius: $border-radius $border-radius 0 0;
                border-left-width: $border-width;
                border-top-width: $border-width;
                border-right-width: $border-width;
              }

              &:last-child {
                border-radius: 0 0 $border-radius $border-radius;
                border-left-width: $border-width;
                border-bottom-width: $border-width;
                border-right-width: $border-width;
              }

              &:not(:last-child, :first-child) {
                border-left-width: $border-width;
                border-right-width: $border-width;

                .#{$prefix}__container {
                  border-bottom-style: solid;
                  border-bottom-width: $container-border-width;
                }
              }

              // divider:
              &:not(:last-child) {
                .#{$prefix}__container {
                  border-bottom-style: solid;
                  border-bottom-width: $container-border-width;
                }
              }
            }

            &:not(.#{$prefix}_joined) {
              border-radius: $border-radius;
              border-style: solid;
              border-width: $container-border-width;
            }
          }

          .#{$prefix}__title {
            @extend %t__#{$title-font-style};
          }

          .#{$prefix}__description {
            @extend %t__#{$description-font-style};
          }

          .#{$prefix}__chevron {
            @include box($chevron-size);
          }
        }
      }
    }
  }
}

@mixin defineStates($prefix, $mode, $tone, $state) {
  &.#{$prefix}_state-#{$state} {
    @include themify($themes) {
      background-color: themed(
        "components.molecules.#{$prefix}.#{$mode}.#{$tone}.root.background.#{$state}"
      );
      border-color: themed(
        "components.molecules.#{$prefix}.#{$mode}.#{$tone}.root.border.#{$state}"
      );
    }

    .#{$prefix}__title {
      @include themify($themes) {
        color: themed(
          "components.molecules.#{$prefix}.#{$mode}.#{$tone}.title.#{$state}"
        );
      }
    }

    .#{$prefix}__description {
      @include themify($themes) {
        fill: themed(
          "components.molecules.#{$prefix}.#{$mode}.#{$tone}.description.#{$state}"
        );
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
          &:focus {
            outline: none;
          }

          &:focus-visible {
            @include themify($themes) {
              outline: get($tokens, "outline") solid
                themed(
                  "components.molecules.#{$prefix}.#{$mode}.#{$tone}.root.border.outline"
                );
            }
          }

          // divider
          &.#{$prefix}_state-selected {
            // hide divider
            .#{$prefix}__container {
              @include themify($themes) {
                border-color: rgba(
                  themed(
                    "components.molecules.#{$prefix}.#{$mode}.#{$tone}.divider.border.normal"
                  ),
                  0
                );
              }
            }
          }

          &:not(.#{$prefix}_state-selected) {
            // show deivider
            .#{$prefix}__container {
              @include themify($themes) {
                border-color: themed(
                  "components.molecules.#{$prefix}.#{$mode}.#{$tone}.divider.border.normal"
                );
              }
            }
          }

          @include themify($themes) {
            background-color: themed(
              "components.molecules.#{$prefix}.#{$mode}.#{$tone}.root.background.selected"
            );
            border-color: themed(
              "components.molecules.#{$prefix}.#{$mode}.#{$tone}.root.border.selected"
            );
          }

          @each $state in ("normal", "disabled", "hovered", "selected") {
            @include defineStates($prefix, $mode, $tone, $state);
          }
        }
      }
    }
  }
}

.#{$prefix} {
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  cursor: pointer;
  @extend %base-transition;

  &__container {
    display: flex;
    flex-direction: row;
    @extend %base-transition;
  }

  &__content {
    width: 100%;
  }

  @include defineSizes();
  @include defineThemes();
}
</style>
