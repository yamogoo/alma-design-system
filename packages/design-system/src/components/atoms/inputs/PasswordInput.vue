<script setup lang="ts">
import { computed, ref, watch } from "vue";
import g from "gsap";

import {
  Input,
  ControlButton,
  type PasswordInputProps,
} from "@/components/atoms";

const MASKED_BUTTON_SCALE_OUT = 0.75,
  MASKED_BUTTON_SCALE_IN = 1;

const MASKED_BUTTON_DURATION = 0.15;

const props = withDefaults(defineProps<PasswordInputProps>(), {
  isMaskIconShown: true,
  masked: true,
});

const emit = defineEmits<{
  (e: "focused", isFocused: boolean): void;
  (e: "update:value", value: string | number): void;
  (e: "reset:value"): void;
  (e: "update:masked", isMasked: boolean): void;
}>();

const localMasked = ref(props.masked);

const isMarkedButtonShown = computed(() => {
  const isValueEmpty = props.value !== "";
  return isValueEmpty;
});

const onMaskValue = (): void => {
  const newValue = !localMasked.value;
  localMasked.value = newValue;

  emit("update:masked", newValue);
};

watch(
  () => props.masked,
  (newValue) => {
    localMasked.value = newValue;
  }
);

const onFocus = (isFocused: boolean): void => {
  emit("focused", isFocused);
};

const onUpdateValue = (value: string | number): void => {
  emit("update:value", value);
};

const onReset = (): void => {
  emit("reset:value");
};

/* * * Animations * * */

const onAnimMaskedButtonEnter = (el: Element, done: () => void): void => {
  g.fromTo(
    el,
    { scale: MASKED_BUTTON_SCALE_OUT, opacity: 0 },
    {
      scale: MASKED_BUTTON_SCALE_IN,
      opacity: 1,
      ease: "power4.out",
      duration: MASKED_BUTTON_DURATION,
      onComplete: done,
    }
  );
};

const onAnimMaskedButtonLeave = (el: Element, done: () => void): void => {
  g.to(el, {
    scale: MASKED_BUTTON_SCALE_OUT,
    opacity: 0,
    ease: "power4.out",
    duration: MASKED_BUTTON_DURATION,
    onComplete: done,
  });
};
</script>

<template>
  <Input
    v-bind="props"
    :type="localMasked ? 'password' : 'text'"
    @focused="onFocus"
    @reset:value="onReset"
    @update:value="onUpdateValue"
  >
    <template #controls>
      <Transition
        :css="false"
        @enter="onAnimMaskedButtonEnter"
        @leave="onAnimMaskedButtonLeave"
      >
        <ControlButton
          v-if="isMarkedButtonShown"
          data-testid="input-mask-button"
          :size="'xs'"
          :icon-size="'xs'"
          :mode="!isError ? 'neutral' : 'negative'"
          :tone="'primary'"
          :icon-name="!localMasked ? 'eye' : 'eyeDisabled'"
          :icon-style="'outline'"
          :icon-weight="'400'"
          role="button"
          :aria-label="'mask button'"
          @click="onMaskValue"
        />
      </Transition>
    </template>
  </Input>
</template>
