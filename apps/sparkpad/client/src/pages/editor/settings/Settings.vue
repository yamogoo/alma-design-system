<script setup lang="ts">
import { computed, ref, watch, type ComputedRef } from "vue";
import { useRouter } from "vue-router";

import { menuItems, type AsyncComp, type SettingsProps } from "./Settings";

import {
  ActionSheetSettingsTemplate,
  type IMenuitem,
} from "@alma/design-system";

const props = defineProps<SettingsProps>();

const emit = defineEmits<{
  (e: "update:is-open", isOpen: boolean): void;
}>();

const router = useRouter();

const localIsOpen = ref(props.isOpen);

const selectedItemIndexes = ref(menuItems.top[0].id);

const currentItem: ComputedRef<IMenuitem<AsyncComp> | null> = computed(() => {
  const sid = selectedItemIndexes.value;

  let currentItem: IMenuitem<AsyncComp> | null = null;

  Object.values(menuItems).map((section) => {
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
  <ActionSheetSettingsTemplate
    v-model:is-open="localIsOpen"
    v-model:selected-item-indexes="selectedItemIndexes"
    :menu-items="menuItems"
  >
    <component :is="currentItem?.value"></component>
  </ActionSheetSettingsTemplate>
</template>
