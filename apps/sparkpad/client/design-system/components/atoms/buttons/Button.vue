<script setup lang="ts">
import {
  toValue,
  ref,
  watch,
  computed,
  type ComputedRef,
  useTemplateRef,
  useSlots,
} from "vue";
import g from "gsap";

import tokens from "@/tokens";

import { useHover } from "@/composables/local";

import type { IconSize } from "@/adapters";

import { Icon, type ButtonProps } from "@/components/atoms";

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
    tokens.atoms.button[props.variant][props.size].icon.alias.size
      .$value as IconSize
);

const onDown = (e: PointerEvent): void => {
  localIsPressed.value = true;
  emit("pointerdown", e);
};

const onUp = (e: PointerEvent): void => {
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

const hasPrependSlot = !!useSlots()?.["prepend-icon"];
const hasAppendSlot = !!useSlots()?.["append-icon"];
</script>

<template>
  <component
    :is="componentTag"
    ref="root"
    role="button"
    class="button"
    :class="[
      {
        [`button_variant-${variant}`]: !!variant,
        [`button_size-${size}`]: !!size,
        [`button_mode-${mode}`]: !!mode,
        [`button_tone-${tone}`]: !!tone,
        [`button_direction-${contentDirection}`]: !!contentDirection,
        [`button_stretch-${stretch}`]: !!stretch,
        [`button_hovered`]: isHovered,
        [`button_disabled`]: isDisabled,
        button_pressed: localIsPressed,
      },
    ]"
    data-testid="button"
    :aria-label="label ?? prependIconName ?? appendIconName"
    :aria-disabled="isDisabled"
    @pointerdown="onDown"
    @pointerup="onUp"
  >
    <Icon
      v-if="prependIconName && !hasPrependSlot"
      :data-testid="'button__icon'"
      :name="prependIconName"
      :appearance="prependIconStyle"
      :weight="prependIconWeight"
      :size="iconSize ?? computedButtonSize"
    ></Icon>
    <slot name="prepend-icon"></slot>
    <div v-if="$slots.content" class="button__content">
      <slot name="content"></slot>
    </div>
    <span v-if="label" class="button__label" data-testid="button-label">{{
      label
    }}</span>
    <slot name="append-icon"></slot>
    <Icon
      v-if="appendIconName && !hasAppendSlot"
      :name="appendIconName"
      :appearance="appendIconStyle"
      :weight="appendIconWeight"
      :size="iconSize ?? computedButtonSize"
    ></Icon>
  </component>
</template>

<style lang="scss">
@use "sass:map";

@mixin defineButtonSizes($map: get($atoms, "button")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.button_size-#{$size} {
          @extend %button_variant-#{$variant}_size-#{$size};
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.atoms.button")) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.button_tone-#{$tone} {
          @extend %button_mode-#{$mode}_tone-#{$tone};
        }
      }
    }
  }
}

.button {
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  user-select: none;
  @extend %base-transition;

  @include defineButtonSizes();
  @include defineThemes();

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
