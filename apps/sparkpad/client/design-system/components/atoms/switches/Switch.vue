<script setup lang="ts">
import { useAttrs, useId, onMounted, watch, useTemplateRef } from "vue";
import g from "gsap";

import { usePressed } from "@/composables/local";

import type { SwitchProps } from "@/components/atoms";

defineOptions({
  inheritAttrs: false,
});

useAttrs();

const props = withDefaults(defineProps<SwitchProps>(), {
  variant: "default",
  mode: "primary",
  size: "md",
  isActive: false,
  isDisabled: false,
  useNative: false,
});

const emit = defineEmits<{
  (e: "update:is-active", state: boolean): void;
}>();

const id = useId();

const refRoot = useTemplateRef<HTMLLabelElement | HTMLDivElement | null>(
  "root"
);
const refTrack = useTemplateRef<HTMLLabelElement | HTMLDivElement | null>(
  "track"
);
const refKnob = useTemplateRef<HTMLDivElement | null>("knob");

const { isPressed } = usePressed(refRoot);

const onChange = (e: Event): void => {
  if (props.isDisabled) return;

  const state = (e.target as HTMLInputElement).checked;
  emit("update:is-active", state);
};

const onKeyDown = (e: KeyboardEvent): void => {
  if (props.isDisabled) return;
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    emit("update:is-active", !props.isActive);
  }
};

watch(isPressed, (val) => {
  if (!val && !props.useNative) emit("update:is-active", !props.isActive);
});

/* * * Animations * * */

const onAnimateKnob = (duration = 0.25): void => {
  const trackWidth = refTrack.value?.clientWidth || 0;
  const knobWidth = refKnob.value?.clientWidth || 0;

  const offsetX = trackWidth - knobWidth;

  if (refKnob.value) {
    const knobPosX = props.isActive ? offsetX : 0;

    g.to(refKnob.value, {
      x: knobPosX,
      duration,
      ease: "power4.out",
    });
  }
};

watch(
  () => props.isActive,
  () => {
    onAnimateKnob();
  }
);

onMounted(() => {
  if (refKnob.value) {
    onAnimateKnob(0.0);
  }
});
</script>

<template>
  <template v-if="!useNative">
    <div
      ref="root"
      :class="[
        'switch',
        `switch_variant-${variant}`,
        `switch_mode-${mode}`,
        `switch_size-${size}`,
        `switch_state-${isActive ? 'active' : 'normal'}`,
        { switch_disabled: isDisabled },
      ]"
      role="switch"
      :aria-labelledby="`label-${id}`"
      :aria-checked="isActive"
      :aria-disabled="isDisabled"
      tabindex="0"
      @keydown="onKeyDown"
    >
      <div class="switch__track">
        <div ref="track" class="switch__track-container">
          <span ref="knob" class="switch__knob"></span>
        </div>
      </div>
      <span v-if="label" class="switch__label">{{ label }}</span>
    </div>
  </template>
  <template v-if="useNative">
    <label
      ref="root"
      :for="id"
      :class="[
        'switch',
        `switch_variant-${variant}`,
        `switch_mode-${mode}`,
        `switch_size-${size}`,
        `switch_state-${isActive ? 'active' : 'normal'}`,
        { switch_disabled: isDisabled },
      ]"
      :aria-labelledby="`label-${id}`"
      tabindex="0"
    >
      <input
        :id
        v-bind="$attrs"
        type="checkbox"
        :checked="isActive"
        @change="onChange"
      />
      <div class="switch__track">
        <div class="switch__track-container">
          <span ref="knob" class="switch__knob"></span>
        </div>
      </div>
      <span v-if="label" class="switch__label">{{ label }}</span>
    </label>
  </template>
</template>

<style lang="scss">
@use "sass:map";

@mixin defineSizes($map: get($atoms, "switch")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.switch_size-#{$size} {
          $gap: get($val, "root.gap");
          $width: px2rem(get($val, "root.width"));
          $height: px2rem(get($val, "root.height"));

          $track-padding: px2rem(get($val, "track.padding"));
          $label-font-style: get($val, "label.font-style");

          $knob-width: px2rem(get($val, "knob.width"));
          $knob-height: px2rem(get($val, "knob.height"));
          $knob-border-radius: calc($knob-height / 2);

          gap: $gap;

          .switch__track {
            @include box($width, $height);
            border-radius: $height;
            padding: $track-padding;
          }

          .switch__knob {
            @include box($knob-width, $knob-height);
            border-radius: $knob-border-radius;
          }

          .switch__label {
            @extend %t__#{$label-font-style};
          }
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.atoms.switch")) {
  @each $mode, $modes in $map {
    &_mode-#{$mode} {
      &:not(.switch_disabled) {
        &.switch_state {
          &-normal {
            .switch__track {
              @include themify($themes) {
                background-color: themed("atoms.switch.#{$mode}.track.normal");
              }
            }

            .switch__knob {
              @include themify($themes) {
                background-color: themed("atoms.switch.#{$mode}.knob.normal");
              }
            }

            .switch__label {
              @include themify($themes) {
                color: themed("atoms.switch.#{$mode}.label.normal");
              }
            }
          }

          &-active {
            .switch__track {
              @include themify($themes) {
                background-color: themed("atoms.switch.#{$mode}.track.active");
              }
            }

            .switch__knob {
              @include themify($themes) {
                background-color: themed("atoms.switch.#{$mode}.knob.active");
              }
            }

            .switch__label {
              @include themify($themes) {
                color: themed("atoms.switch.#{$mode}.label.active");
              }
            }
          }
        }
      }

      &.switch_disabled {
        &.switch_state {
          &-normal {
            .switch__track {
              @include themify($themes) {
                background-color: themed(
                  "atoms.switch.#{$mode}.track.disabled"
                );
              }
            }

            .switch__knob {
              @include themify($themes) {
                background-color: themed("atoms.switch.#{$mode}.knob.disabled");
              }
            }

            .switch__label {
              @include themify($themes) {
                color: themed("atoms.switch.#{$mode}.label.disabled");
              }
            }
          }

          &-active {
            .switch__track {
              @include themify($themes) {
                background-color: themed(
                  "atoms.switch.#{$mode}.track.disabled"
                );
              }
            }

            .switch__knob {
              @include themify($themes) {
                background-color: themed("atoms.switch.#{$mode}.knob.disabled");
              }
            }

            .switch__label {
              @include themify($themes) {
                color: themed("atoms.switch.#{$mode}.label.disabled");
              }
            }
          }
        }
      }
    }
  }
}

.switch {
  box-sizing: border-box;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  cursor: pointer;
  @include box(max-content);

  @include defineSizes();
  @include defineThemes();

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  &__track {
    overflow: hidden;

    &-container {
      @include box(100%);
    }
  }

  &__knob {
    display: block;
  }
}
</style>
