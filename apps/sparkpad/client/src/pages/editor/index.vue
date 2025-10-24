<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";

import { Constants } from "@/constants";

import { useSettingsStore, useEditorLayout } from "@/stores";

import { Page, ResizeBounding } from "@alma/design-system";

import Settings from "@/pages/editor/settings/Settings.vue";
import { EditorView, SidebarMenu, Explorer } from "@/components/organisms";

const route = useRoute();
const router = useRouter();

const settings = useSettingsStore();
const { setIsOpen } = settings;

const layout = useEditorLayout();
const { navigatorWidth, isNavigatorShown } = storeToRefs(layout);
const { setNavigatorWidth } = layout;

const localIsOpen = ref(false);

watchEffect(() => {
  setIsOpen(localIsOpen.value);
});

const onOpenSettings = (): void => {
  localIsOpen.value = true;
  void router.push({ query: { ...route.query, settings: "appearance" } });
};

/* * * Layout * * */

const localNavigatorWidth = computed({
  get: () => {
    return navigatorWidth.value;
  },
  set: (width: number) => {
    setNavigatorWidth(width);
  },
});
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
