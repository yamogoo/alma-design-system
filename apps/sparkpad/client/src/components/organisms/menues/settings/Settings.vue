<script setup lang="ts">
import { ref, watch } from "vue";

import type { SettingsProps } from "./Settings";

import {
  ActionSheet,
  ActionSheetSidebar,
  List,
  Spacer,
  MenuItem,
  type IMenuitem,
} from "@alma/design-system";

import Appearance from "./Appearance.vue";

const props = defineProps<SettingsProps>();

const emit = defineEmits<{
  (e: "update:is-open", isOpen: boolean): void;
}>();

const localIsOpen = ref(props.isOpen);

const sidebarItems: Record<"top" | "bottom", IMenuitem[]> = {
  top: [
    {
      id: "appearance",
      label: "Appearance",
      iconName: "colorPalette",
      iconStyle: "outline",
    },
    {
      id: "workspace",
      label: "Workspace",
      iconName: "console",
      iconStyle: "outline",
    },
    {
      id: "system",
      label: "System",
      iconName: "cog",
      iconStyle: "outline",
    },
  ],
  bottom: [
    {
      id: "account",
      label: "Account",
      iconName: "userThumbnail",
      iconStyle: "outline",
    },
  ],
};

watch(
  () => props.isOpen,
  (newValue) => {
    localIsOpen.value = newValue;
  }
);

watch(localIsOpen, (newValue) => {
  emit("update:is-open", newValue);
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
          :size="'sm'"
          stretch="fill"
          :is-selectable="true"
          :is-joined="false"
        >
          <MenuItem
            :id="item.id"
            v-for="item in sidebarItems.top"
            :is-active="true"
            :title="item.label"
            :icon-name="item.iconName"
          ></MenuItem>
          <Spacer></Spacer>
          <MenuItem
            :id="item.id"
            v-for="item in sidebarItems.bottom"
            :is-active="true"
            :title="item.label"
            :icon-name="item.iconName"
          ></MenuItem>
        </List>
      </ActionSheetSidebar>
    </template>
    <Appearance></Appearance>
  </ActionSheet>
</template>
