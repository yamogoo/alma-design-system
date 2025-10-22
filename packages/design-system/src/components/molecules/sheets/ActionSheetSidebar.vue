<script setup lang="ts">
import type { ActionSheetSidebarProps } from "./ActionSheetSidebar";
import Sidebar from "@/components/molecules/panels/Sidebar.vue";

withDefaults(defineProps<ActionSheetSidebarProps>(), {});
</script>

<template>
  <Sidebar class="action-sheet-sidebar">
    <slot></slot>
  </Sidebar>
</template>

<style lang="scss">
$tokenName: "action-sheet-sidebar";
$prefix: getPrefix($tokenName);

.#{$prefix} {
  box-sizing: border-box;
  position: relative;
  height: 100%;
  overflow: auto;
  padding: 4px;
}
</style>
