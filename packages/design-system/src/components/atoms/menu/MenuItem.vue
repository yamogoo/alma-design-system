<script setup lang="ts">
import { useTemplateRef, watch } from "vue";

import { usePressed } from "@/composables/local/actions/usePressed";

import type { MenuItemProps } from "@/components/atoms/menu/MenuItem";

const PREFIX = "menu-item";

withDefaults(defineProps<MenuItemProps>(), {
  isActive: false,
});

const emit = defineEmits<{
  (e: "press"): void;
  (e: "release"): void;
  (e: "is-pressed", isPressed: boolean): void;
}>();

const refRoot = useTemplateRef<HTMLDivElement | null>("root");

const { isPressed } = usePressed(refRoot);

watch(isPressed, (isState) => {
  emit("is-pressed", isState);
  isState ? emit("press") : emit("release");
});
</script>

<template>
  <div ref="root" :class="PREFIX" :aria-selected="isActive">
    <slot></slot>
  </div>
</template>
