<script setup lang="ts">
import type { ActionButtonProps } from "./ActionButton";
import Button from "@/components/atoms/buttons/Button.vue";

const props = withDefaults(defineProps<ActionButtonProps>(), {});

const emit = defineEmits<{
  (e: "press", ev: PointerEvent): void;
  (e: "release", ev: PointerEvent): void;
}>();

const onPointerUp = (e: PointerEvent): void => {
  if (props.isDisabled) return;
  emit("release", e);
};

const onPointerDown = (e: PointerEvent): void => {
  if (props.isDisabled) return;
  emit("press", e);
};
</script>

<template>
  <Button
    v-bind="props"
    :prepend-icon-name="iconName"
    :prepend-icon-style="iconStyle"
    :prepend-icon-weight="iconWeight"
    @pointerup="onPointerUp"
    @pointerdown="onPointerDown"
  >
    <template #prepend-icon>
      <slot name="prepend-icon"></slot>
    </template>
    <template #append-icon>
      <slot name="append-icon"></slot>
    </template>
  </Button>
</template>
