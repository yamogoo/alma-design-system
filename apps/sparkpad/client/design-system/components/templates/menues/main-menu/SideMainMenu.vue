<script setup lang="ts" generic="T = string">
import type { SideMainMenuProps } from "@/components/templates";
import { type IMenuItem, SimpleMenu } from "@/components/atoms";

withDefaults(defineProps<SideMainMenuProps<T>>(), {});

const emit = defineEmits<{
  (e: "select", item: IMenuItem<T>): void;
  (e: "update:selected-item-id", id: number): void;
}>();

const onSelectItem = (item: IMenuItem<T>): void => {
  emit("select", item);

  const { id } = item;
  emit("update:selected-item-id", id);
};
</script>

<template>
  <div class="side-main-menu">
    <SimpleMenu
      :selected-item-id="selectedItemId"
      :items
      @select="onSelectItem"
    ></SimpleMenu>
  </div>
</template>

<style lang="scss">
/* .side-main-menu {} */
</style>
