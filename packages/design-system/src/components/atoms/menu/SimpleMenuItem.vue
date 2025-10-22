<script setup lang="ts">
import { useTemplateRef, watch } from "vue";

import { usePressed } from "@/composables/local/actions/usePressed";

import { MENU_ITEM_PREFIX, type SimpleMenuItemProps } from "./SimpleMenuItem";

withDefaults(defineProps<SimpleMenuItemProps>(), {
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
  <div ref="root" :class="MENU_ITEM_PREFIX" :aria-selected="isActive">
    <slot></slot>
  </div>
</template>

<style lang="scss">
$tokenName: "menu-item";
$prefix: getPrefix($tokenName);
</style>
