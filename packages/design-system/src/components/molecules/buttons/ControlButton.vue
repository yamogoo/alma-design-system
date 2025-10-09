<script setup lang="ts">
import type { ControlButtonProps } from "./ControlButton";

import Button from "@/components/atoms/buttons/Button.vue";

const props = withDefaults(defineProps<ControlButtonProps>(), {
  variant: "rounded",
});

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
    :icon-size="iconSize"
    @pointerup="onPointerUp"
    @pointerdown="onPointerDown"
  ></Button>
</template>
