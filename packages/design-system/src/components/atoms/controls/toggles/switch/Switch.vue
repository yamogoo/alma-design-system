<script setup lang="ts">
import {
  useAttrs,
  useId,
  onMounted,
  watch,
  useTemplateRef,
  ref,
  computed,
} from "vue";
import gsap from "gsap";

import { usePressed } from "@/composables/local/actions/usePressed";

import type { SwitchProps } from "./Switch";

const PREFIX = "switch";

defineOptions({
  inheritAttrs: false,
});

useAttrs();

const props = withDefaults(defineProps<SwitchProps>(), {
  variant: "default",
  mode: "neutral",
  tone: "primary",
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

const localIsActive = ref(false);

// Native
const onChange = (e: Event): void => {
  if (props.isDisabled) return;

  const state = (e.target as HTMLInputElement).checked;

  localIsActive.value = state;
  emit("update:is-active", localIsActive.value);
};

// Custom
watch(isPressed, (val) => {
  if (!val && !props.useNative) {
    localIsActive.value = !localIsActive.value;

    emit("update:is-active", localIsActive.value);
  }
});

const onKeyDown = (e: KeyboardEvent): void => {
  if (props.isDisabled) return;
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    emit("update:is-active", !props.isActive);
  }
};

/* * * a11y * * */

const ariaLabelId = `${PREFIX}__label-${id}`;

const ariaLabelledBy = computed(() => {
  return props.label && props.label.trim() ? ariaLabelId : undefined;
});

const ariaLabel = computed(() => {
  return !props.label || !props.label.trim() ? "Switch" : undefined;
});

/* * * Animations * * */

const onAnimateKnob = (duration = 0.25): void => {
  const trackWidth = refTrack.value?.clientWidth || 0;
  const knobWidth = refKnob.value?.clientWidth || 0;

  const offsetX = trackWidth - knobWidth;

  if (refKnob.value) {
    const knobPosX = localIsActive.value ? offsetX : 0;

    gsap.to(refKnob.value, {
      x: knobPosX,
      duration,
      ease: "power4.out",
    });
  }
};

watch(localIsActive, () => {
  onAnimateKnob();
});

watch(
  () => props.isActive,
  (newValue) => {
    if (localIsActive.value !== newValue) {
      localIsActive.value = newValue;
    }

    onAnimateKnob();
  },
  {
    immediate: true,
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
        PREFIX,
        `${PREFIX}_variant-${variant}`,
        `${PREFIX}_mode-${mode}`,
        `${PREFIX}_size-${size}`,
        `${PREFIX}_tone-${tone}`,
        `${PREFIX}_state-${localIsActive ? 'active' : 'normal'}`,
        { [`${PREFIX}_state-disabled`]: isDisabled },
      ]"
      role="switch"
      :aria-labelledby="ariaLabelledBy"
      :aria-label="ariaLabel"
      :aria-checked="localIsActive"
      :aria-disabled="isDisabled"
      tabindex="0"
      @keydown="onKeyDown"
    >
      <div :class="`${PREFIX}__track`">
        <div ref="track" :class="`${PREFIX}__track-container`">
          <span ref="knob" :class="`${PREFIX}__knob`"></span>
        </div>
      </div>
      <span v-if="label" :id="ariaLabelId" :class="`${PREFIX}__label`">{{
        label
      }}</span>
    </div>
  </template>
  <template v-if="useNative">
    <label
      ref="root"
      :for="`${PREFIX}_id-${id}`"
      :class="[
        PREFIX,
        `${PREFIX}_variant-${variant}`,
        `${PREFIX}_size-${size}`,
        `${PREFIX}_mode-${mode}`,
        `${PREFIX}_tone-${tone}`,
        `${PREFIX}_state-${isActive ? 'active' : 'normal'}`,
        { [`${PREFIX}_state-disabled`]: isDisabled },
      ]"
      tabindex="0"
    >
      <input
        v-bind="$attrs"
        :id="`${PREFIX}_id-${id}`"
        type="checkbox"
        :checked="isActive"
        :disabled="isDisabled"
        :aria-labelledby="ariaLabelledBy"
        :aria-label="ariaLabel"
        @change="onChange"
      />
      <div :class="`${PREFIX}__track`">
        <div :class="`${PREFIX}__track-container`">
          <span ref="knob" :class="`${PREFIX}__knob`"></span>
        </div>
      </div>
      <span v-if="label" :id="ariaLabelId" :class="`${PREFIX}__label`">{{
        label
      }}</span>
    </label>
  </template>
</template>

<style lang="scss">
$prefix: switch;

@mixin defineSizes($map: get($components, "atoms.#{$prefix}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.switch_size-#{$size} {
          $gap: get($val, "root.gap");
          $width: px2rem(get($val, "root.width"));
          $height: px2rem(get($val, "root.height"));
          $touch-area: px2rem(get($val, "root.touch-area"));

          $track-padding: px2rem(get($val, "track.padding"));
          $label-font-style: get($val, "label.font-style");

          $knob-width: px2rem(get($val, "knob.width"));
          $knob-height: px2rem(get($val, "knob.height"));
          $knob-border-radius: calc($knob-height / 2);

          gap: $gap;
          border-radius: $height;
          height: $touch-area;

          .#{$prefix} {
            &__track {
              @include box($width, $height);
              border-radius: $height;
              padding: $track-padding;
            }

            &__knob {
              @include box($knob-width, $knob-height);
              border-radius: $knob-border-radius;
            }

            &__label {
              @extend %t__#{$label-font-style};
            }
          }
        }
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
            .#{$prefix}__track {
              @include themify($themes) {
                outline: get($tokens, "outline") solid
                  themed(
                    "components.atoms.#{$prefix}.#{$mode}.#{$tone}.root.highlight"
                  );
              }
            }
          }

          &:not(.#{$prefix}_state-disabled) {
            &.#{$prefix}_state {
              &-normal {
                .#{$prefix}__track {
                  @include themify($themes) {
                    background-color: themed(
                      "components.atoms.#{$prefix}.#{$mode}.#{$tone}.track.normal"
                    );
                  }
                }

                .#{$prefix}__knob {
                  @include themify($themes) {
                    background-color: themed(
                      "components.atoms.#{$prefix}.#{$mode}.#{$tone}.knob.normal"
                    );
                  }
                }

                .#{$prefix}__label {
                  @include themify($themes) {
                    color: themed(
                      "components.atoms.#{$prefix}.#{$mode}.#{$tone}.label.normal"
                    );
                  }
                }
              }

              &-active {
                .#{$prefix}__track {
                  @include themify($themes) {
                    background-color: themed(
                      "components.atoms.#{$prefix}.#{$mode}.#{$tone}.track.active"
                    );
                  }
                }

                .#{$prefix}__knob {
                  @include themify($themes) {
                    background-color: themed(
                      "components.atoms.#{$prefix}.#{$mode}.#{$tone}.knob.active"
                    );
                  }
                }

                .#{$prefix}__label {
                  @include themify($themes) {
                    color: themed(
                      "components.atoms.#{$prefix}.#{$mode}.#{$tone}.label.active"
                    );
                  }
                }
              }
            }
          }

          &.#{$prefix}_state-disabled {
            &.#{$prefix}_state {
              &-normal {
                .#{$prefix}__track {
                  @include themify($themes) {
                    background-color: themed(
                      "components.atoms.#{$prefix}.#{$mode}.#{$tone}.track.disabled"
                    );
                  }
                }

                .#{$prefix}__knob {
                  @include themify($themes) {
                    background-color: themed(
                      "components.atoms.#{$prefix}.#{$mode}.#{$tone}.knob.disabled"
                    );
                  }
                }

                .#{$prefix}__label {
                  @include themify($themes) {
                    color: themed(
                      "components.atoms.#{$prefix}.#{$mode}.#{$tone}.label.disabled"
                    );
                  }
                }
              }

              &-active {
                .#{$prefix}__track {
                  @include themify($themes) {
                    background-color: themed(
                      "components.atoms.#{$prefix}.#{$mode}.#{$tone}.track.disabled"
                    );
                  }
                }

                .#{$prefix}__knob {
                  @include themify($themes) {
                    background-color: themed(
                      "components.atoms.#{$prefix}.#{$mode}.#{$tone}.knob.disabled"
                    );
                  }
                }

                .#{$prefix}__label {
                  @include themify($themes) {
                    color: themed(
                      "components.atoms.#{$prefix}.#{$mode}.#{$tone}.label.disabled"
                    );
                  }
                }
              }
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
