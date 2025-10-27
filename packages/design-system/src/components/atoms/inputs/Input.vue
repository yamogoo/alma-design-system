<script setup lang="ts">
import {
  ref,
  watch,
  watchEffect,
  useId,
  computed,
  toValue,
  onMounted,
  useTemplateRef,
} from "vue";
import gsap from "gsap";
import { useFocus } from "@vueuse/core";

import { UIFACETS, UISTATES } from "@/constants/ui";

import { sanitizeInput } from "@/utils/sanitize";

import { INPUT_PREFIX, type InputProps } from "@/components/atoms/inputs/Input";
import AnimatedWrapper from "@/components/atoms/containers/AnimatedWrapper.vue";
import ControlButton from "@/components/molecules/buttons/aliases/ControlButton.vue";
import Text from "@/components/atoms/typography/Text.vue";

const RESET_BUTTON_SCALE_IN = 1,
  RESET_BUTTON_SCALE_OUT = 0.75;

const RESET_BUTTON_DURATION = 0.15;

const props = withDefaults(defineProps<InputProps>(), {
  variant: "default",
  mode: "neutral",
  tone: "primary",
  size: "lg",
  type: "text",
  isError: false,
  isDisabled: false,
  isRestButtonEnabled: true,
  autocomplete: "off",
  errorMessage: null,
});

const emit = defineEmits<{
  (e: "focused", isFocused: boolean): void;
  (e: "update:value", value: string): void;
  (e: "change:value", value: string): void;
  (e: "reset:value"): void;
}>();

defineOptions({ inheritAttrs: false });

const refInput = useTemplateRef<HTMLInputElement | null>("input");
const refPlaceholder = useTemplateRef<HTMLLabelElement | null>("placeholder");
const refMessage = useTemplateRef<HTMLDivElement | null>("message");

const id = useId();
const localModelValue = ref(props.value);

const sanitize = async () =>
  (localModelValue.value = await sanitizeInput(localModelValue.value));

const isResetButtonShown = computed(() => localModelValue.value !== "");

const { focused: isLocalFocused } = useFocus(refInput, {
  initialValue: props.isFocused,
});

const isIdle = computed(() => {
  const value = localModelValue.value === "";
  return value;
});

watchEffect(() => {
  emit("focused", isLocalFocused.value);
});

watch(
  () => props.isFocused,
  (isFocused) => {
    isLocalFocused.value = isFocused;
  }
);

watch(
  () => props.value,
  (newValue) => {
    if (localModelValue.value !== newValue) {
      localModelValue.value = newValue;
    }
  }
);

watch(localModelValue, (newValue) => {
  emit("update:value", newValue);
});

const onFocus = (): void => {
  if (props.isDisabled) return;

  isLocalFocused.value = true;
};

const onChange = (e: Event): void => {
  const value = (e.target as HTMLInputElement).value;
  emit("change:value", value);
};

const onReset = (): void => {
  localModelValue.value = "";

  emit("reset:value");
};

/* * * a11y * * */

const validationId = `validation-${id}`;

/* * * Animations * * */

const onAnimInputValue = (
  input: HTMLInputElement | null,
  durationFactor = 1,
  isFocused: boolean,
  value?: string
): void => {
  const isEmpty = (value || "").length === 0;

  const OPACITY_IN = 1,
    OPACITY_OUT = 0;

  if (input) {
    gsap?.to(input, {
      opacity: isFocused ? OPACITY_IN : isEmpty ? OPACITY_OUT : OPACITY_IN,
      duration: 0.1 * durationFactor,
      ease: "power4.out",
    });
  }
};

const onAnimPlaceholder = (
  placeholder: HTMLLabelElement | null,
  durationFactor = 1,
  isFocused: boolean,
  value: string
): void => {
  const isEmpty = (value || "").length === 0;

  const SCALE_IN = 1,
    SCALE_OUT = 0.75;

  const OFFSET_IN = "50%",
    OFFSET_IN_INVERSED = "-50%",
    OFFSET_OUT = "5%";

  const OPACITY_IN = 1,
    OPACITY_OUT = 0.65;

  if (placeholder)
    gsap?.to(placeholder, {
      y: isFocused ? OFFSET_OUT : isEmpty ? OFFSET_IN_INVERSED : OFFSET_OUT,
      top: isFocused ? OFFSET_OUT : isEmpty ? OFFSET_IN : OFFSET_OUT,
      scale: isFocused ? SCALE_OUT : isEmpty ? SCALE_IN : SCALE_OUT,
      opacity: isFocused ? OPACITY_OUT : isEmpty ? OPACITY_IN : OPACITY_OUT,
      duration: 0.25 * durationFactor,
      ease: "power4.out",
    });
};

const onAnimErrorMessage = (
  message: HTMLSpanElement | null,
  durationFactor = 1
) => {
  const messageHeight = message?.clientHeight || 0;
  const isError = !!props.errorMessage || props.isError;

  const OPACITY_IN = 1,
    OPACITY_OUT = 0,
    POS_Y_IN = 0,
    POS_Y_OUT = messageHeight;

  if (message) {
    gsap?.to(message, {
      opacity: isError ? OPACITY_IN : OPACITY_OUT,
      y: isError ? POS_Y_IN : POS_Y_OUT,
      duration: 0.1 * durationFactor,
      ease: "power4.out",
    });
  }
};

const animate = (durationFactor = 1): void => {
  const placeholder = refPlaceholder.value;
  const input = refInput.value;
  const message = refMessage.value;
  const value = toValue(localModelValue);
  const isFocused = toValue(isLocalFocused);

  onAnimPlaceholder(placeholder, durationFactor, isFocused, value);
  onAnimInputValue(input, durationFactor, isFocused, value);
  onAnimErrorMessage(message, durationFactor);
};

watch(
  () => [isLocalFocused.value, localModelValue.value],
  () => {
    animate(1);
  }
);

onMounted(() => {
  animate(0);
});

// reset button

const onAnimResetButtonEnter = (el: Element, done: () => void): void => {
  if (!gsap) {
    done();
    return;
  }

  gsap.fromTo(
    el,
    { scale: RESET_BUTTON_SCALE_OUT, opacity: 0 },
    {
      scale: RESET_BUTTON_SCALE_IN,
      opacity: 1,
      ease: "power4.out",
      duration: RESET_BUTTON_DURATION,
      onComplete: done,
    }
  );
};

const onAnimResetButtonLeave = (el: Element, done: () => void): void => {
  if (!gsap) {
    done();
    return;
  }

  gsap.to(el, {
    scale: RESET_BUTTON_SCALE_OUT,
    opacity: 0,
    ease: "power4.out",
    duration: RESET_BUTTON_DURATION,
    onComplete: done,
  });
};
</script>

<template>
  <AnimatedWrapper
    :id="id"
    :content-key="String(errorMessage)"
    :duration="0.3"
    :class="[
      INPUT_PREFIX,
      `${INPUT_PREFIX}_${UIFACETS.VARIANT}-${variant}`,
      `${INPUT_PREFIX}_${UIFACETS.MODE}-${mode}`,
      `${INPUT_PREFIX}_${UIFACETS.TONE}-${tone}`,
      `${INPUT_PREFIX}_${UIFACETS.STATE}-${isIdle ? UISTATES.IDLE : UISTATES.NORMAL}`,
      {
        [`${INPUT_PREFIX}_${UIFACETS.SIZE}-${size}`]: size,
        [`${INPUT_PREFIX}_${UIFACETS.STATE}-${UISTATES.ERROR}`]: isError,
        [`${INPUT_PREFIX}_${UIFACETS.STATE}-${UISTATES.DISABLED}`]: isDisabled,
        [`${INPUT_PREFIX}_${UIFACETS.STATE}-${UISTATES.FOCUSED}`]:
          isLocalFocused,
      },
    ]"
    :data-testid="INPUT_PREFIX"
  >
    <div :class="`${INPUT_PREFIX}__field`" @pointerdown="onFocus">
      <div :class="`${INPUT_PREFIX}__field-content`">
        <div v-if="$slots.icon" :class="`${INPUT_PREFIX}__field-content-icon`">
          <slot name="icon"></slot>
        </div>
        <div :class="`${INPUT_PREFIX}__field-inner-content`">
          <label
            v-if="placeholder || placeholder === ''"
            ref="placeholder"
            :for="id"
            :class="`${INPUT_PREFIX}__field-placeholder`"
          >
            {{ placeholder }}
          </label>
          <input
            :id
            ref="input"
            v-model="localModelValue"
            :type
            :class="`${INPUT_PREFIX}__field-value`"
            :data-testid="`${INPUT_PREFIX}__value`"
            :aria-placeholder="ariaPlaceholder ?? placeholder"
            :aria-invalid="isError"
            :aria-describedby="errorMessage ? validationId : undefined"
            :disabled="isDisabled"
            :autocomplete
            :spellcheck="'false'"
            @change="onChange"
          />
        </div>
        <slot name="controls"></slot>
        <Transition
          :css="false"
          @enter="onAnimResetButtonEnter"
          @leave="onAnimResetButtonLeave"
        >
          <ControlButton
            v-if="isResetButtonShown"
            type="reset"
            :class="`${INPUT_PREFIX}__field-reset-button`"
            :data-testid="`${INPUT_PREFIX}__field-reset-button`"
            :size="'xs'"
            :mode="
              !isError
                ? mode === 'neutral'
                  ? 'neutral'
                  : 'accent'
                : 'negative'
            "
            :tone="'primary'"
            :icon-name="'cross'"
            :icon-style="'outline'"
            :icon-weight="'500'"
            @input="sanitize"
            @click="onReset"
          />
        </Transition>
      </div>
    </div>
    <div
      ref="message"
      :id="validationId"
      :class="`${INPUT_PREFIX}__validation`"
    >
      <Text
        v-if="!!errorMessage"
        :class="`${INPUT_PREFIX}__validation-message`"
        :variant="'caption-1'"
      >
        {{ errorMessage.toLowerCase() }}
      </Text>
    </div>
  </AnimatedWrapper>
</template>

<style lang="scss">
$tokenName: "input";
$prefix: getPrefix($tokenName);
$iconSlotPrefix: getPrefix("#{$tokenName}__icon");

@mixin defineInputSizes($map: get($components, "atoms.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $value-font-style: get($val, "label.font-style");
      $placeholder-font-style: get($val, "placeholder.font-style");
      $validation-message-font-style: get(
        $val,
        "validation-message.font-style"
      );

      $value-padding-top: px2rem(get($val, "label.padding-top"));

      $height: get($val, "root.height");
      $whole-height: get($val, "root.whole-height");
      $padding: get($val, "root.padding");
      $border-radius: get($val, "root.border-radius");
      $validation-message-padding: get($val, "validation-message.padding");

      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          .#{$prefix}__field {
            height: $height;
            padding: $padding;
            border-radius: $border-radius;
          }

          .#{$prefix}__field-value {
            padding-top: $value-padding-top;
            @extend %t__#{$value-font-style};
          }

          .#{$prefix}__field-placeholder {
            @extend %t__#{$placeholder-font-style};
          }

          .#{$prefix}__validation-message {
            padding: $validation-message-padding;

            &-message {
              @extend %t__#{$validation-message-font-style};
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
      .#{$prefix}__field {
        @include themify($themes) {
          color: themed(
            "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.label.#{$state}"
          );
          background-color: themed(
            "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.root.background.#{$state}"
          );
          border: get($tokens, "outline") solid
            themed(
              "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.root.border.#{$state}"
            );
        }

        .#{$prefix}__field-content-icon {
          .#{$iconSlotPrefix} {
            @include themify($themes) {
              fill: themed(
                "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.label.#{$state}"
              );
            }
          }
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
          &:not(.#{$prefix}_state-disabled) {
            @include defineStates($tokenName, $mode, $tone, "idle");
          }

          &:not(.#{$prefix}_state-error) {
            &:not(.#{$prefix}_state-focused) {
              @include defineStates($tokenName, $mode, $tone, "idle" "normal");
            }

            @include defineStates(
              $tokenName,
              $mode,
              $tone,
              "focused" "disabled"
            );
          }

          &.#{$prefix}_state-error {
            @include defineStates($tokenName, $mode, $tone, "error");
          }

          .#{$prefix}__validation {
            &-message {
              @include themify($themes) {
                color: themed(
                  "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.validation.message"
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
  box-sizing: border-box;
  position: relative;

  @include defineInputSizes();
  @include defineThemes();

  &__field {
    box-sizing: border-box;
    position: relative;

    &-placeholder {
      position: absolute;
      display: block;
      transform-origin: left top;
      pointer-events: none;
      z-index: 0;
    }

    &-content {
      display: flex;
      align-items: center;
      gap: px2rem(get($tokens, "gap.xs"));
      height: 100%;

      &-icon {
        height: max-content;
      }
    }

    &-inner-content {
      @include box(100%);

      &-icon {
        height: max-content;
      }
    }

    &-value {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      flex: 1 0 0;
      @include box(100%);
      outline: none;
      border: none;
      background: none;
      overflow: hidden;
      text-overflow: ellipsis;
      user-select: auto;
      pointer-events: all;
      z-index: 1;
      @include useThemeTransition();

      @include useSelection();
    }
  }

  &__field-value,
  &__field-placeholder {
    color: inherit;
  }

  &__field,
  &__field-value,
  &__field-placeholder,
  &__validation-message {
    @include useThemeTransition();
  }
}
</style>
