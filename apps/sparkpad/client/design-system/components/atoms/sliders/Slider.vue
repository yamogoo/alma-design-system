<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, useTemplateRef } from "vue";
import { useHover } from "@/composables/local";
import { type SliderProps } from "@/components/atoms";

const props = withDefaults(defineProps<SliderProps>(), {
  variant: "default",
  size: "md",
  mode: "accent",
  tone: "primary",
  min: 0,
  max: 100,
  step: 1,
  value: 0,
});

const emit = defineEmits<{
  (e: "update:value", value: number): void;
}>();

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
watch(localValue, (nv) => {
  emit("update:value", clamp(nv, props.min, props.max));
});

const computedValueFromClientX = (clientX: number): number => {
  const track = trackRect ?? refTrack.value?.getBoundingClientRect() ?? null;

  if (!track) return localValue.value;

  const x = clamp(clientX - track.left, 0, track.width);
  const raw = props.min + (x / track.width) * (props.max - props.min);
  const snapped = roundToStep(raw, props.step, props.min);

  return clamp(snapped, props.min, props.max);
};

const onTrackPress = (e: PointerEvent) => {
  if (!refTrack.value) return;

  refTrack.value.setPointerCapture?.(e.pointerId);
  trackRect = refTrack.value.getBoundingClientRect();
  const newVal = computedValueFromClientX(e.clientX);
  localValue.value = newVal;

  isDragging.value = true;

  addEventListeners();
  e.preventDefault();
};

const onKnobPress = (e: PointerEvent): void => {
  if (!refTrack.value) return;

  refKnob.value?.setPointerCapture?.(e.pointerId);
  trackRect = refTrack.value.getBoundingClientRect();

  isDragging.value = true;

  addEventListeners();
  e.preventDefault();
};

const onDragMove = (e: PointerEvent) => {
  if (!isDragging.value) return;
  localValue.value = computedValueFromClientX(e.clientX);
};

const onDragEnd = () => {
  if (!isDragging.value) return;
  isDragging.value = false;
  removeEventListeners();
};

/* Keyboard */
const onKnobKeydown = (e: KeyboardEvent) => {
  let delta = 0;
  if (e.key === "ArrowRight" || e.key === "ArrowUp") delta = props.step;
  else if (e.key === "ArrowLeft" || e.key === "ArrowDown") delta = -props.step;
  if (delta !== 0) {
    e.preventDefault();

    localValue.value = clamp(
      roundToStep(localValue.value + delta, props.step, props.min),
      props.min,
      props.max
    );
  }
};

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

onBeforeUnmount(() => {
  removeEventListeners();
});
</script>

<template>
  <div
    ref="root"
    class="slider"
    :class="[
      `slider_variant-${variant}`,
      `slider_size-${size}`,
      ` slider_mode-${mode}`,
      `slider_tone-${tone}`,
      `slider_state-${isHovered ? 'hovered' : 'normal'}`,
    ]"
  >
    <div class="slider__track" @pointerdown="onTrackPress">
      <div
        ref="track"
        class="slider__track-container"
        :style="{ '--p': percent / 100 }"
      >
        <div class="slider__range-track" aria-hidden="true"></div>

        <div
          ref="knob"
          class="slider__knob"
          role="slider"
          tabindex="0"
          :aria-valuemin="min"
          :aria-valuemax="max"
          :aria-valuenow="localValue"
          :style="{
            position: 'absolute',
            left: 'calc(var(--p) * 100%)',
            transform: 'translateX(-50%)',
            touchAction: 'none',
            cursor: 'grab',
            zIndex: 1,
          }"
          @pointerdown="onKnobPress"
          @keydown="onKnobKeydown"
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use "sass:math";

@mixin defineSizes($map: get($atoms, "slider")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.slider_size-#{$size} {
          $gap: px2rem(get($val, "root.gap"));
          $min-width: px2rem(get($val, "root.min-width"));
          $padding: px2rem(get($val, "root.padding"));

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
          min-height: $knob-height;
          padding: $padding;

          .slider__track {
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

          .slider__knob {
            @include box($knob-width, $knob-height);
            border-radius: $knob-border-radius;
            border-style: solid;
            border-width: $knob-border-width;
          }

          .slider__label {
            @include themify($themes) {
              @extend %t__#{$label-font-style};
            }
          }
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.atoms.slider")) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.slider_tone-#{$tone} {
          &.slider_state-normal {
            .slider__track {
              @include themify($themes) {
                background: themed(
                  "atoms.slider.#{$mode}.#{$tone}.track.background.normal"
                );
              }
            }

            .slider__range-track,
            .slider__track::before {
              @include themify($themes) {
                background: themed(
                  "atoms.slider.#{$mode}.#{$tone}.range-track.background.normal"
                );
              }
            }

            .slider__knob {
              @include themify($themes) {
                background: themed(
                  "atoms.slider.#{$mode}.#{$tone}.knob.background.normal"
                );
                border-color: themed(
                  "atoms.slider.#{$mode}.#{$tone}.knob.border-color.normal"
                );
              }
            }
          }

          &.slider_state-hovered {
            .slider__track {
              @include themify($themes) {
                background: themed(
                  "atoms.slider.#{$mode}.#{$tone}.track.background.hovered"
                );
              }
            }

            .slider__range-track,
            .slider__track::before {
              @include themify($themes) {
                background: themed(
                  "atoms.slider.#{$mode}.#{$tone}.range-track.background.hovered"
                );
              }
            }

            .slider__knob {
              @include themify($themes) {
                background: themed(
                  "atoms.slider.#{$mode}.#{$tone}.knob.background.hovered"
                );
              }
            }
          }

          &__label {
            @include themify($themes) {
              background: themed(
                "atoms.slider.#{$mode}.#{$tone}.label.color.normal"
              );
            }
          }
        }
      }
    }
  }
}

.slider {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;

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
      --p: 0%;
    }
  }

  &__range-track {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    transform-origin: left center;
    transform: scaleX(calc(var(--p)));
    will-change: transform;
    box-sizing: border-box;
    z-index: 0;

    &::before {
      pointer-events: none;
    }
  }

  &__knob {
    box-sizing: border-box;
    position: absolute;
    left: 0;
    will-change: transform;
  }
}
</style>
