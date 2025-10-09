<script setup lang="ts">
import { watch } from "vue";
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

watch(
  () => props.isOpen,
  (newValue, oldValue) => {
    if (newValue !== oldValue) emit("update:is-open", newValue);
  }
);

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

.#{$prefix} {
  position: fixed;
  inset: 0;
  /* pointer-events: none; */

  :where(&) {
    z-index: 1000;
  }
}
</style>
