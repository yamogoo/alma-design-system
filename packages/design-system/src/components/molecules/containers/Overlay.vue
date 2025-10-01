<!-- is the base for components that float over the rest of the page -->
<script setup lang="ts">
import type { OverlayProps } from "./Overlay";

import Surface from "@/components/atoms/containers/Surface.vue";

const PREFIX = "overlay";

withDefaults(defineProps<OverlayProps>(), {
  variant: "default",
});
</script>

<template>
  <Surface
    :class="[PREFIX]"
    :variant="variant"
    :size="size"
    :mode="mode"
    :tone="tone"
  ></Surface>
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
