<script setup lang="ts">
import type { OverlayProps } from "./Overlay";

import Surface from "@/components/atoms/containers/Surface.vue";

const PREFIX = "overlay";

const props = withDefaults(defineProps<OverlayProps>(), {
  containerId: "body",
  variant: "default",
});

const emit = defineEmits<{
  (e: "update:is-open", isOpen: boolean): void;
}>();

const onClose = (): void => {
  emit("update:is-open", false);
};
</script>

<template>
  <Teleport :to="containerId">
    <Surface
      v-if="props.isOpen"
      :class="[PREFIX]"
      v-bind="props"
      @click.self="onClose"
    >
      <slot></slot> </Surface
  ></Teleport>
</template>

<style lang="scss">
$prefix: overlay;

.overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: none;
}
</style>
