<script setup lang="ts">
import { computed, ref, watch, type ComputedRef } from "vue";
import { useRouter } from "vue-router";

import { sidebarItems, type AsyncComp, type SettingsProps } from "./Settings";

import {
  ActionSheet,
  ActionSheetSidebar,
  List,
  Spacer,
  MenuItem,
  type IMenuitem,
} from "@alma/design-system";

const props = defineProps<SettingsProps>();

const emit = defineEmits<{
  (e: "update:is-open", isOpen: boolean): void;
}>();

const router = useRouter();

const localIsOpen = ref(props.isOpen);

const selectedItemIndexes = ref(sidebarItems.top[0].id);

const currentItem: ComputedRef<IMenuitem<AsyncComp> | null> = computed(() => {
  const sid = selectedItemIndexes.value;

  let currentItem: IMenuitem<AsyncComp> | null = null;

  Object.values(sidebarItems).map((section) => {
    section.find((item) => {
      if (item.id === sid) currentItem = item;
    });
  });

  return currentItem;
});

watch(
  () => props.isOpen,
  (newValue) => {
    localIsOpen.value = newValue;
  }
);

watch(
  localIsOpen,
  (newValue) => {
    emit("update:is-open", newValue);
  },
  { immediate: true }
);

watch(selectedItemIndexes, () => {
  void router.replace({ query: { settings: currentItem.value?.id } });
});
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
          v-model:selected-item-indexes="selectedItemIndexes"
          size="sm"
          stretch="fill"
          :is-selectable="true"
          :is-radio-button="true"
          :is-joined="false"
        >
          <MenuItem
            v-for="item in sidebarItems.top"
            :id="item.id"
            :is-active="true"
            :title="item.label"
            :icon-name="item.iconName"
          ></MenuItem>
          <Spacer></Spacer>
          <MenuItem
            v-for="item in sidebarItems.bottom"
            :id="item.id"
            :is-active="true"
            :title="item.label"
            :icon-name="item.iconName"
          ></MenuItem>
        </List>
      </ActionSheetSidebar>
    </template>
    <component :is="currentItem?.value"></component>
  </ActionSheet>
</template>
