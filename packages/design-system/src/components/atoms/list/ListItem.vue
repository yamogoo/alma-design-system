<script setup lang="ts">
import { computed, inject, useSlots, useTemplateRef } from "vue";

import { UIFACETS, UIMODIFIERS, UISTATES } from "@/constants/ui";

import { useHover } from "@/composables/local/actions/useHover";

import { LIST_ITEM_PREFIX, type ListItemProps } from "./ListItem";
import {
  ListInjectionKey,
  type ListInjection,
} from "@/components/molecules/list/List";
import Text from "@/components/atoms/typography/Text.vue";
import Icon from "@/components/atoms/icons/Icon.vue";

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
  (e: "focus:next"): void;
  (e: "focus:prev"): void;
}>();

const root = useTemplateRef<HTMLDivElement | null>("root");
const ctx = inject<ListInjection | null>(ListInjectionKey, null);

const hasUserContent = computed(() => {
  const s = slots.default?.();
  return !!(s && s.length);
});

const { isHovered } = useHover(root);

const isSelected = computed(() => {
  // control selected state via props:
  // if (props.isActive !== undefined) return props.isActive;

  // control selected state via injected:
  if (!ctx?.selectedItemIndexes) return false;
  const sid = ctx.selectedItemIndexes.value;
  return Array.isArray(sid) ? sid.includes(props.id) : sid === props.id;
});

const effectiveState = computed(() => {
  if (ctx?.isSelectable && ctx.isSelectable.value === false)
    return UISTATES.NORMAL;
  if (isSelected.value) return UISTATES.SELECTED;
  return isHovered.value ? UISTATES.HOVERED : UISTATES.NORMAL;
});

const cursor = computed(() => (isSelectable.value ? "pointer" : "auto"));

const isSelectable = computed(() => Boolean(ctx?.isSelectable?.value));
const role = computed(() => (isSelectable.value ? "option" : "listitem"));

const ariaSelected = computed(() =>
  isSelectable.value ? String(isSelected.value) : undefined
);

const tabIndex = computed(() => (props.isFocused ? 0 : -1));

const localIsJoined = computed(() => {
  return ctx?.isJoined ? ctx.isJoined.value : props.isJoined;
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

  if (ctx?.selectedItemIndexes) ctx.setSelectedItemIndexes(props.id);
  emit("press", e);
};

/* * * Keyboard * * */

const onFocusNext = (): void => {
  emit("focus:next");
};

const onFocusPrev = (): void => {
  emit("focus:prev");
};
</script>

<template>
  <component
    :is="as"
    ref="root"
    :class="[
      LIST_ITEM_PREFIX,
      {
        [`${LIST_ITEM_PREFIX}_${UIFACETS.VARIANT}-${variant}`]: !!variant,
        [`${LIST_ITEM_PREFIX}_${UIFACETS.SIZE}-${size}`]: !!size,
        [`${LIST_ITEM_PREFIX}_${UIFACETS.MODE}-${mode}`]: !!mode,
        [`${LIST_ITEM_PREFIX}_${UIFACETS.TONE}-${tone}`]: !!tone,
      },
      `${LIST_ITEM_PREFIX}_${UIFACETS.STATE}-${effectiveState}`,
      { [`${LIST_ITEM_PREFIX}_${UIMODIFIERS.JOINED}`]: localIsJoined },
    ]"
    :style="{ cursor }"
    :role="role"
    :aria-selected="ariaSelected"
    :tabindex="tabIndex"
    :aria-current="isCurrentItemShown && isSelected ? true : undefined"
    @pointerdown="(e: PointerEvent) => onPress(e, true)"
    @pointerup="(e: PointerEvent) => onPress(e, false)"
    @keydown.enter.space.prevent="ctx?.setSelectedItemIndexes?.(props.id)"
    @keydown.arrow-down.prevent="onFocusNext"
    @keydown.arrow-up.prevent="onFocusPrev"
  >
    <div :class="`${LIST_ITEM_PREFIX}__container`">
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
        <div :class="`${LIST_ITEM_PREFIX}__content`">
          <Text
            v-if="title"
            :class="`${LIST_ITEM_PREFIX}__title`"
            :data-testid="`${LIST_ITEM_PREFIX}-title`"
          >
            {{ title }}
          </Text>
          <Text
            v-if="description"
            :class="`${LIST_ITEM_PREFIX}__description`"
            :data-testid="`${LIST_ITEM_PREFIX}-description`"
          >
            {{ description }}
          </Text>
        </div>
      </template>
      <div :class="`${LIST_ITEM_PREFIX}__append`">
        <slot name="append">
          <Icon
            :class="`${LIST_ITEM_PREFIX}__chevron`"
            :name="'right'"
            :appearance="'outline'"
            :weight="'300'"
            :size="iconSize"
          ></Icon>
        </slot>
      </div>
    </div>
  </component>
</template>

<style lang="scss">
$tokenName: "list-item";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "atoms.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          $content-gap: px2rem(get($val, "root.gap"));
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
              gap: $content-gap;
              padding: $padding-vertical 0;
            }

            &_joined {
              // top:
              &:first-child {
                border-radius: $border-radius $border-radius 0 0;
                border-left-width: $border-width;
                border-top-width: $border-width;
                border-right-width: $border-width;
              }

              // middle:
              &:not(:last-child, :first-child) {
                border-left-width: $border-width;
                border-right-width: $border-width;

                .#{$prefix}__container {
                  border-bottom-style: solid;
                  border-bottom-width: $container-border-width;
                }
              }

              // bottom:
              &:last-child {
                border-radius: 0 0 $border-radius $border-radius;
                border-left-width: $border-width;
                border-bottom-width: $border-width;
                border-right-width: $border-width;
              }

              // one in list:
              &:first-child:last-child {
                border-radius: $border-radius $border-radius;
                border-width: $border-width;
                border-width: $border-width;
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

          @include where(".#{$prefix}__title") {
            @extend %t__#{$title-font-style};
          }
          @include where(".#{$prefix}__description") {
            @extend %t__#{$description-font-style};
          }
          @include where(".#{$prefix}__chevron") {
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
        "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.root.background.#{$state}"
      );
      border-color: themed(
        "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.root.border.#{$state}"
      );
    }

    .#{$prefix}__title {
      @include themify($themes) {
        color: themed(
          "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.title.#{$state}"
        );
      }
    }

    .#{$prefix}__description {
      @include themify($themes) {
        color: themed(
          "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.description.#{$state}"
        );
      }
    }

    .#{$prefix}__chevron {
      @include themify($themes) {
        fill: themed(
          "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.chevron.#{$state}"
        );
      }
    }
  }
}

@mixin defineThemes(
  $map: get($themes, "light.components.atoms.#{$tokenName}")
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
                  "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.root.border.highlight"
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
                    "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.divider.border.normal"
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
                  "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.divider.border.normal"
                );
              }
            }
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
  @include useThemeTransition();

  @include where(".#{$prefix}__container") {
    display: flex;
    flex-direction: row;
    @include useThemeTransition();
  }

  @include where(".#{$prefix}__content") {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
  }

  @include where(".#{$prefix}__append") {
    align-content: center;
  }

  &__append {
    align-content: center;
  }

  @include defineSizes();
  @include defineThemes();
}
</style>
