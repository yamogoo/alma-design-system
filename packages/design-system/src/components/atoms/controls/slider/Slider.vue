<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, useTemplateRef } from "vue";
import gsap from "gsap";

import { UIFACETS, UISTATES } from "@/constants/ui";

import { useHover } from "@/composables/local/actions/useHover";

import { SLIDER_PREFIX, type SliderProps } from "./Slider";

const props = withDefaults(defineProps<SliderProps>(), {
  variant: "default",
  size: "lg",
  mode: "accent",
  tone: "primary",
  min: 0,
  max: 100,
  step: 10,
  value: 0,
  /** Stick to steps when dragging/clicking on a track */
  isSnapToStep: false,
  /** Sticking threshold in pixels relative to track width (px) */
  snapThreshold: 10,
  isDisabled: false,
  isPageKeysEnabled: false,
  knobAnimScaleActive: 1.35,
  knobAnimScaleNormal: 1.0,
  knobAnimDuration: 0.45,
});

const emit = defineEmits<{ (e: "update:value", value: number): void }>();

const refRoot = useTemplateRef<HTMLDivElement | null>("root");
const refTrack = useTemplateRef<HTMLDivElement | null>("track");
const refKnob = useTemplateRef<HTMLDivElement | null>("knob");

const localValue = ref<number>(props.value);
const isDragging = ref(false);
let trackRect: DOMRect | null = null;

const { isHovered } = useHover(refRoot);

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const roundToStep = (v: number, step: number, min: number) => {
  if (step <= 0) return v;
  const steps = Math.round((v - min) / step);
  return min + steps * step;
};

const getPercentage = (value: number, min: number, max: number): number =>
  ((value - min) / Math.max(1e-9, max - min)) * 100;

const percent = computed(() =>
  getPercentage(localValue.value, props.min, props.max)
);

watch(
  () => props.value,
  (newValue) => {
    if (!isDragging.value)
      localValue.value = clamp(newValue, props.min, props.max);
  }
);
watch(localValue, (newValue) =>
  emit("update:value", clamp(newValue, props.min, props.max))
);

/* * * Without Snapping * * */
const rawValueFromClientX = (clientX: number): number => {
  const track = trackRect ?? refTrack.value?.getBoundingClientRect() ?? null;

  if (!track) return localValue.value;

  const x = clamp(clientX - track.left, 0, track.width);
  const ratio = x / Math.max(1e-9, track.width);
  const raw = props.min + ratio * (props.max - props.min);

  return clamp(raw, props.min, props.max);
};

/* * * Snapping * * */

const computedValueFromClientX = (clientX: number): number => {
  const track = trackRect ?? refTrack.value?.getBoundingClientRect() ?? null;
  const raw = rawValueFromClientX(clientX);

  if (!props.isSnapToStep || !track) return raw;

  const stepped = roundToStep(raw, props.step, props.min);

  const pxToValue = (px: number) =>
    (px / Math.max(1e-9, track.width)) * (props.max - props.min);
  const thresholdValue = pxToValue(props.snapThreshold);

  if (Math.abs(stepped - raw) <= thresholdValue) {
    return clamp(stepped, props.min, props.max);
  }
  return raw;
};

const onTrackPress = (e: PointerEvent) => {
  if (!refTrack.value || props.isDisabled) return;

  e.preventDefault();

  refTrack.value.setPointerCapture?.(e.pointerId);
  trackRect = refTrack.value.getBoundingClientRect();
  localValue.value = computedValueFromClientX(e.clientX);
  isDragging.value = true;

  addEventListeners();
};

const onKnobPress = (e: PointerEvent): void => {
  if (!refTrack.value || props.isDisabled) return;

  e.preventDefault();

  refKnob.value?.setPointerCapture?.(e.pointerId);
  trackRect = refTrack.value.getBoundingClientRect();
  isDragging.value = true;

  addEventListeners();
};

const onDragMove = (e: PointerEvent) => {
  if (!isDragging.value || props.isDisabled) return;
  localValue.value = computedValueFromClientX(e.clientX);
};

const onDragEnd = () => {
  if (!isDragging.value) return;
  isDragging.value = false;

  removeEventListeners();

  if (!props.isSnapToStep) return;
  localValue.value = roundToStep(localValue.value, props.step, props.min);
};

/* * * a11y * * */

const ariaLabel = `${SLIDER_PREFIX}`;

/* * * Keyboard * * */

const onKnobKeydown = (e: KeyboardEvent) => {
  if (props.isDisabled) return;

  let delta = 0;

  if (e.key === "ArrowRight" || e.key === "ArrowUp") delta = props.step;
  else if (e.key === "ArrowLeft" || e.key === "ArrowDown") delta = -props.step;

  if (props.isPageKeysEnabled) {
    if (e.key === "Home") delta = props.min - localValue.value;
    if (e.key === "End") delta = props.max - localValue.value;
    if (e.key === "PageUp") delta = props.step * 10;
    if (e.key === "PageDown") delta = -props.step * 10;
  }

  if (delta !== 0) {
    e.preventDefault();

    localValue.value = clamp(
      roundToStep(localValue.value + delta, props.step, props.min),
      props.min,
      props.max
    );
  }
};

watch(isHovered, (state) => {
  const el = refKnob.value;

  if (el) {
    gsap.to(el, {
      scale: state ? props.knobAnimScaleActive : props.knobAnimScaleNormal,
      duration: props.knobAnimDuration,
      ease: "power4.out",
    });
  }
});

const addEventListeners = (): void => {
  window.addEventListener("pointermove", onDragMove, { passive: true });
  window.addEventListener("pointerup", onDragEnd, { passive: true });
  window.addEventListener("pointercancel", onDragEnd, { passive: true });
};
const removeEventListeners = (): void => {
  window.removeEventListener("pointermove", onDragMove);
  window.removeEventListener("pointerup", onDragEnd);
  window.removeEventListener("pointercancel", onDragEnd);
};

onBeforeUnmount(removeEventListeners);
</script>

<template>
  <div
    ref="root"
    :class="[
      SLIDER_PREFIX,
      `${SLIDER_PREFIX}_${UIFACETS.VARIANT}-${variant}`,
      `${SLIDER_PREFIX}_${UIFACETS.SIZE}-${size}`,
      `${SLIDER_PREFIX}_${UIFACETS.MODE}-${mode}`,
      `${SLIDER_PREFIX}_${UIFACETS.TONE}-${tone}`,
      isDisabled
        ? `${SLIDER_PREFIX}_${UIFACETS.STATE}-${UISTATES.DISABLED}`
        : `${SLIDER_PREFIX}_${UIFACETS.STATE}-${isDragging ? UISTATES.PRESSED : isHovered ? UISTATES.HOVERED : UISTATES.NORMAL}`,
    ]"
    @pointerdown="onTrackPress"
  >
    <div :class="`${SLIDER_PREFIX}__track`">
      <div
        ref="track"
        :class="`${SLIDER_PREFIX}__track-container`"
        :style="{ '--p': percent / 100 }"
      >
        <div :class="`${SLIDER_PREFIX}__range-track`" aria-hidden="true"></div>

        <div
          ref="knob"
          :class="`${SLIDER_PREFIX}__knob`"
          :style="{
            left: 'calc(var(--p) * 100%)',
          }"
          role="slider"
          aria-orientation="horizontal"
          :aria-label="ariaLabel"
          :aria-valuemin="min"
          :aria-valuemax="max"
          :aria-valuenow="localValue"
          tabindex="0"
          @pointerdown="onKnobPress"
          @keydown="onKnobKeydown"
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$tokenName: "slider";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "atoms.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          $gap: px2rem(get($val, "root.gap"));
          $min-width: px2rem(get($val, "root.min-width"));
          $padding: px2rem(get($val, "root.padding"));
          $touch-area: px2rem(get($val, "root.touch-area"));

          $knob-width: px2rem(get($val, "knob.width"));
          $knob-height: px2rem(get($val, "knob.height"));
          $knob-border-radius: px2rem(get($val, "knob.border-radius"));
          $knob-border-width: px2rem(get($val, "knob.border-width"));

          $track-height: px2rem(get($val, "track.height"));
          $track-border-radius: px2rem(get($val, "track.border-radius"));
          $track-padding: calc($knob-width / 2);

          $label-font-style: get($val, "label.font-style");

          gap: $gap;
          min-width: $min-width;
          min-height: $touch-area;
          padding: $padding;

          .#{$prefix}__track {
            @include box(100%, $track-height);
            border-radius: $track-border-radius;
            padding: 0 $track-padding;

            &::before {
              position: absolute;
              top: 0;
              left: 0;
              bottom: 0;
              content: "";
              @include box($knob-width, $knob-height);
              border-radius: $knob-border-radius;
            }
          }

          .#{$prefix}__knob {
            @include box($knob-width, $knob-height);
            border-radius: $knob-border-radius;
            border-style: solid;
            border-width: $knob-border-width;
          }

          .#{$prefix}__label {
            @include themify($themes) {
              @extend %t__#{$label-font-style};
            }
          }
        }
      }
    }
  }
}

@mixin defineStates($tokenName, $mode, $tone, $states) {
  @each $state in $states {
    &.#{$prefix}_state-#{$state} {
      .#{$prefix}__track {
        @include themify($themes) {
          background: themed(
            "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.track.background.#{$state}"
          );
        }
      }

      .#{$prefix}__range-track,
      .#{$prefix}__track::before {
        @include themify($themes) {
          background: themed(
            "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.range-track.background.#{$state}"
          );
        }
      }

      .#{$prefix}__knob {
        @include themify($themes) {
          background: themed(
            "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.knob.background.#{$state}"
          );
          border-color: themed(
            "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.knob.border-color.#{$state}"
          );
        }
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
                  "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.root.highlight"
                );
            }
          }

          @include defineStates(
            $tokenName,
            $mode,
            $tone,
            "normal" "hovered" "disabled" "pressed"
          );

          &__label {
            @include themify($themes) {
              background: themed(
                "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.label.color.normal"
              );
            }
          }
        }
      }
    }
  }
}

.#{$prefix} {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  direction: ltr;

  @include defineSizes();
  @include defineThemes();

  &__track {
    position: relative;
    box-sizing: border-box;
    touch-action: none;

    &-container {
      position: relative;
      box-sizing: border-box;
      @include box(100%);
      --p: 0;
    }
  }

  &__range-track {
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    transform-origin: left center;
    transform: scaleX(var(--p));
    will-change: transform;
    z-index: 0;

    &::before {
      pointer-events: none;
    }
  }

  &__knob {
    box-sizing: border-box;
    position: absolute;
    left: 0;
    transform: translateX(-50%);
    touch-action: none;
    will-change: transform;
    z-index: 1;
  }

  &_state-normal,
  &_state-hovered {
    .#{$prefix}__track,
    .#{$prefix}__knob {
      cursor: grab;
    }
  }

  &_state-pressed {
    .#{$prefix}__track,
    .#{$prefix}__knob {
      cursor: grabbing;
    }
  }
}
</style>
