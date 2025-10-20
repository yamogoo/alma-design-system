<script setup lang="ts">
import type { ActionSheetSidebarProps } from "./ActionSheetSidebar";
import Surface from "@/components/atoms/containers/Surface.vue";

withDefaults(defineProps<ActionSheetSidebarProps>(), {});
</script>

<template>
  <Surface class="action-sheet-sidebar">
    <slot></slot>
  </Surface>
</template>

<style lang="scss"></style>
