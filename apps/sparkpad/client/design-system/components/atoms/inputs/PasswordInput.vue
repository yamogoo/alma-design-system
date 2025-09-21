<script setup lang="ts">
import {
  Input,
  ControlButton,
  type PasswordInputProps,
} from "@/components/atoms";
import { ref, watch } from "vue";

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
      <ControlButton
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
    </template>
  </Input>
</template>
