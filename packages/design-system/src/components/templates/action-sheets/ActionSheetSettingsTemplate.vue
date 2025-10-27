<script setup lang="ts">
import { ref, watch } from "vue";

import ActionSheet from "@/components/molecules/sheets/ActionSheet.vue";
import ActionSheetSidebar from "@/components/molecules/sheets/ActionSheetSidebar.vue";

import List from "@/components/molecules/list/List.vue";
import MenuItem from "@/components/molecules/menu/MenuItem.vue";
import Spacer from "@/components/atoms/containers/Spacer.vue";

import type { ActionSheetSettingsTemplateProps } from "./ActionSheetSettingsTemplate";
import type { ListSelectedItemIndex } from "@/components/molecules/list/List";

const props = withDefaults(defineProps<ActionSheetSettingsTemplateProps>(), {
  isOpen: false,
});

const emit = defineEmits<{
  (
    e: "update:selected-item-indexes",
    selectedItemIndexes: ListSelectedItemIndex | null
  ): void;
  (e: "change", selectedItemIndexes: ListSelectedItemIndex | null): void;
  (e: "update:is-open", isOpen: boolean): void;
}>();

const localIsOpen = ref(props.isOpen);

watch(
  () => props.isOpen,
  (value) => {
    localIsOpen.value = value;
  },
  { immediate: true }
);

watch(localIsOpen, (value) => {
  emit("update:is-open", value);
});

const getInitSelectedItemIndex = (): ListSelectedItemIndex | null => {
  if (
    "top" in props.menuItems &&
    typeof props.menuItems.top === "object" &&
    props.menuItems.top.length > 0
  )
    return props.menuItems.top[0].id;

  return null;
};

const localSelectedItemIndexes = ref(getInitSelectedItemIndex());

watch(
  () => props.selectedItemIndexes,
  (newValue) => {
    localSelectedItemIndexes.value = newValue;
  }
);

const onUpdateSelecteditemIndexes = (
  selectedItemIndexes: ListSelectedItemIndex | ListSelectedItemIndex[] | null
): void => {
  if (typeof selectedItemIndexes !== "object")
    emit("update:selected-item-indexes", selectedItemIndexes);
};
</script>

<template>
  <ActionSheet
    v-model:is-open="localIsOpen"
    size="lg"
    mode="neutral"
    tone="canvas"
    orientation="horizontal"
    align-horizontal="start"
    align-vertical="start"
  >
    <template #sidebar>
      <ActionSheetSidebar>
        <List
          v-model:selected-item-indexes="localSelectedItemIndexes"
          size="sm"
          stretch="fill"
          :is-selectable="true"
          :is-radio-button="true"
          :is-joined="false"
          @update:selected-item-indexes="onUpdateSelecteditemIndexes"
        >
          <MenuItem
            v-if="'top' in menuItems"
            v-for="item in menuItems.top"
            :id="item.id"
            :is-active="true"
            :title="item.label"
            :icon-name="item.iconName"
          ></MenuItem>
          <Spacer></Spacer>
          <MenuItem
            v-if="'bottom' in menuItems"
            v-for="item in menuItems.bottom"
            :id="item.id"
            :is-active="true"
            :title="item.label"
            :icon-name="item.iconName"
          ></MenuItem>
        </List>
      </ActionSheetSidebar>
    </template>
    <slot></slot>
  </ActionSheet>
</template>
