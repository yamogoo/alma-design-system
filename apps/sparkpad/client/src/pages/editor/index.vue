<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";

import { Constants } from "@/constants";

import { useSettingsStore, useEditorLayout } from "@/stores";

import { Page, ResizeBounding } from "@alma/design-system";

import Settings from "@/components/organisms/menues/settings/Settings.vue";
import { EditorView, SidebarMenu, Explorer } from "@/components/organisms";

const settings = useSettingsStore();
const { isOpen: isSettingsOpen } = storeToRefs(settings);
const { setIsOpen } = settings;

const layout = useEditorLayout();
const { navigatorWidth, isNavigatorShown } = storeToRefs(layout);
const { setNavigatorWidth } = layout;

const localIsOpen = computed({
  get: () => {
    return isSettingsOpen.value;
  },
  set: (isOpen: boolean) => {
    setIsOpen(isOpen);
  },
});

const localNavigatorWidth = computed({
  get: () => {
    return navigatorWidth.value;
  },
  set: (width: number) => {
    setNavigatorWidth(width);
  },
});

const onOpenSettings = (): void => {
  setIsOpen(true);
};
</script>

<template>
  <Page orientation="horizontal">
    <SidebarMenu @open:settings="onOpenSettings"></SidebarMenu>
    <ResizeBounding
      v-if="isNavigatorShown"
      data-test="editor-navigator"
      directions="r"
      v-model:width="localNavigatorWidth"
      :min-width="Constants.DEFAULT_NAVIGATOR_MIN_WIDTH"
      :max-width="Constants.DEFAULT_NAVIGATOR_MAX_WIDTH"
    >
      <Explorer></Explorer>
    </ResizeBounding>
    <EditorView></EditorView>
  </Page>
  <Settings v-model:is-open="localIsOpen"></Settings>
</template>
