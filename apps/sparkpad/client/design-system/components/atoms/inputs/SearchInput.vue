<script setup lang="ts">
import { onUnmounted, ref, watch } from "vue";

import { Input, Icon, type SearchFieldProps } from "@/components/atoms";

const props = withDefaults(defineProps<SearchFieldProps>(), {
  variant: "default",
  size: "md",
  mode: "neutral",
  tone: "primary",
  value: "",
  placeholder: "Search",
  isSearchIconShown: true,
  isResetSearchPhraseWhenClosed: true,
});

const emit = defineEmits<{
  (e: "update:value", value: string): void;
  (e: "reset:value"): void;
  (e: "update:focused", isFocused: boolean): void;
}>();

const localModelValue = ref<string>(props.value);
const isInputFocused = ref(false);

watch(
  () => props.value,
  (newValue) => {
    localModelValue.value = newValue;
  }
);

const onUpdateValue = (value: string) => {
  if (localModelValue.value === value) return;
  localModelValue.value = value;
  emit("update:value", value);
};

const onResetValue = (): void => {
  emit("update:value", "");
  emit("reset:value");
};

const onFocus = (isFocused: boolean) => {
  isInputFocused.value = isFocused;
  emit("update:focused", isFocused);
};

onUnmounted(() => {
  if (props.isResetSearchPhraseWhenClosed) onResetValue();
});
</script>

<template>
  <Input
    v-model:value="localModelValue"
    :placeholder="placeholder"
    :variant="variant"
    :size="size"
    :mode="mode"
    :tone="tone"
    :is-focused="isInputFocused"
    :is-disabled="isDisabled"
    autocomplete="off"
    @update:value="onUpdateValue"
    @reset:value="onResetValue"
    @focused="onFocus"
  >
    <template v-if="isSearchIconShown" #icon>
      <Icon
        :class="`icon-preview`"
        :name="'search'"
        :appearance="'outline'"
        :weight="'300'"
      />
    </template>
  </Input>
</template>
