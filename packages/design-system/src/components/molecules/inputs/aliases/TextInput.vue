<script setup lang="ts">
import { type TextInputProps } from "./TextInput";

import Input from "@/components/atoms/inputs/Input.vue";

const props = withDefaults(defineProps<TextInputProps>(), {});

const emit = defineEmits<{
  (e: "focused", isFocused: boolean): void;
  (e: "update:value", value: string | number): void;
  (e: "reset:value"): void;
  (e: "update:masked", isMasked: boolean): void;
}>();

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
    :type="'text'"
    @focused="onFocus"
    @reset:value="onReset"
    @update:value="onUpdateValue"
  >
  </Input>
</template>
