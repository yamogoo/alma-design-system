<script setup lang="ts">
import {
  toValue,
  ref,
  watch,
  computed,
  useTemplateRef,
  type ComputedRef,
} from "vue";
import g from "gsap";

import tokens from "@/tokens";

import { useHover } from "@/composables/local";

import type { IconSize } from "@/adapters/atoms/icon";

import type { ButtonProps } from "./Button";
import Icon from "@/components/atoms/icons/Icon.vue";

const PREFIX = "button";

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: "default",
  as: "button",
  contentDirection: "forward",
  prependIconStyle: "outline",
  prependIconWeight: "500",
  appendIconStyle: "outline",
  appendIconWeight: "500",
  scalePressed: 0.95,
});

defineOptions({
  inheritAttrs: true,
});

const emit = defineEmits<{
  (e: "pointerdown", ev: PointerEvent): void;
  (e: "pointerup", ev: PointerEvent): void;
}>();

const refRoot = useTemplateRef<HTMLButtonElement | null>("root");

const componentTag = props.as;

const { isHovered } = useHover(refRoot);
const localIsPressed = ref(false);

const computedButtonSize: ComputedRef<IconSize> = computed(
  () =>
    tokens.components.atoms.button[props.variant][props.size ?? "md"].icon.alias
      .size.$value as IconSize
);

const onDown = (e: PointerEvent) => {
  if (props.isDisabled) return;

  localIsPressed.value = true;
  emit("pointerdown", e);
};
const onUp = (e: PointerEvent) => {
  if (props.isDisabled) return;

  localIsPressed.value = false;
  emit("pointerup", e);
};

/* * * Animations * * */

const onAnim = (el: HTMLButtonElement, isPressed: boolean): void => {
  g.to(el, {
    scale: isPressed ? props.scalePressed : 1,
    duration: 0.05,
    ease: isPressed ? "power4.out" : "power4.in",
  });
};

watch(localIsPressed, (isPressed) => {
  const el = toValue(refRoot);
  if (el) onAnim(el, isPressed);
});

/* * * Keyboard * * */

const onKeydown = (e: KeyboardEvent) => {
  if (props.isDisabled) return;

  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    localIsPressed.value = true;
  }
};
const onKeyup = (e: KeyboardEvent) => {
  if (props.isDisabled) return;

  if (e.key === " " || e.key === "Enter") {
    localIsPressed.value = false;
  }
};
</script>

<template>
  <component
    :is="componentTag"
    ref="root"
    :role="as !== 'button' ? 'button' : undefined"
    :type="as === 'button' ? 'button' : undefined"
    :class="[
      PREFIX,
      `${PREFIX}_variant-${variant}`,
      `${PREFIX}_size-${size}`,
      `${PREFIX}_mode-${mode}`,
      `${PREFIX}_tone-${tone}`,
      `${PREFIX}_state-${
        localIsPressed ? 'pressed' : isHovered ? 'hovered' : 'normal'
      }`,
      {
        [`${PREFIX}_direction-${contentDirection}`]: !!contentDirection,
        [`${PREFIX}_stretch-${stretch}`]: !!stretch,
        [`${PREFIX}_state-disabled`]: isDisabled,
      },
    ]"
    data-testid="button"
    :aria-label="label || arialLabel || 'button'"
    :aria-disabled="isDisabled"
    :disabled="as === 'button' ? isDisabled : undefined"
    :tabindex="as !== 'button' ? (isDisabled ? -1 : 0) : undefined"
    @pointerdown="onDown"
    @pointerup="onUp"
    @pointerleave="localIsPressed = false"
    @pointercancel="localIsPressed = false"
    @lostpointercapture="localIsPressed = false"
    @blur="localIsPressed = false"
    @keydown="onKeydown"
    @keyup="onKeyup"
  >
    <slot name="prepend-icon">
      <Icon
        v-if="prependIconName"
        :class="`${PREFIX}__icon`"
        :data-testid="'button__icon'"
        :name="prependIconName"
        :appearance="prependIconStyle"
        :weight="prependIconWeight"
        :size="iconSize ?? computedButtonSize"
        aria-hidden="true"
      ></Icon>
    </slot>
    <div v-if="$slots.content" :class="`${PREFIX}__content`">
      <slot name="content"></slot>
    </div>
    <span v-if="label" :class="`${PREFIX}__label`" data-testid="button-label">{{
      label
    }}</span>
    <slot name="append-icon">
      <Icon
        v-if="appendIconName"
        :class="`${PREFIX}__icon`"
        :name="appendIconName"
        :appearance="appendIconStyle"
        :weight="appendIconWeight"
        :size="iconSize ?? computedButtonSize"
        aria-hidden="true"
      ></Icon>
    </slot>
  </component>
</template>

<style lang="scss">
$prefix: "button";

@mixin defineButtonSizes($prefix, $map: get($components, "atoms.#{$prefix}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $button-size: px2rem(get($val, "root.size"));
      $gap: px2rem(get($val, "root.gap"));
      $border-radius: get($val, "root.border-radius");
      $padding: get($val, "root.padding");

      $font-style: get($val, "label.font-style");
      $icon-size: px2rem(get($val, "icon.size"));

      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          gap: $gap;
          height: $button-size;
          min-height: $button-size;
          border-radius: $border-radius;

          &.#{$prefix}_variant-default {
            padding: $padding;
          }

          &.#{$prefix}_variant-rounded,
          &.#{$prefix}_variant-squared {
            width: $button-size !important;
          }

          .#{$prefix}__label {
            @extend %t__#{$font-style};
            line-height: 1;
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
        "components.atoms.#{$prefix}.#{$mode}.#{$tone}.root.background.#{$state}"
      );
      border: get($tokens, "outline") solid
        themed(
          "components.atoms.#{$prefix}.#{$mode}.#{$tone}.root.border.#{$state}"
        );
    }

    .#{$prefix}__label {
      @include themify($themes) {
        color: themed(
          "components.atoms.#{$prefix}.#{$mode}.#{$tone}.label.#{$state}"
        );
        fill: themed(
          "components.atoms.#{$prefix}.#{$mode}.#{$tone}.label.#{$state}"
        );
      }
    }

    .#{$prefix}__icon {
      @include themify($themes) {
        fill: themed(
          "components.atoms.#{$prefix}.#{$mode}.#{$tone}.label.#{$state}"
        );
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.components.atoms.#{$prefix}")) {
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
                  "components.atoms.#{$prefix}.#{$mode}.#{$tone}.root.border.outline"
                );
            }
          }

          @each $state in ("normal", "hovered", "pressed", "disabled") {
            @include defineStates($prefix, $mode, $tone, $state);
          }
        }
      }
    }
  }
}

.#{$prefix} {
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  user-select: none;
  @extend %base-transition;

  @include defineButtonSizes($prefix);
  @include defineThemes();

  &_state-disabled {
    cursor: not-allowed;
    pointer-events: none;
  }

  &_direction {
    @include useDirection();
  }

  &__label {
    @extend %base-transition;
  }

  &__skeleton {
    position: absolute;
    inset: 0;
  }

  &_variant-rounded {
    overflow: hidden;
  }

  &_stretch {
    @include useHorizontalStretch();
  }
}
</style>
