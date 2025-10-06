<script setup lang="ts">
import { storeToRefs } from "pinia";

import { Constants } from "@/constants";

import { useSettingsStore, useEditorLayout } from "@/stores";

import { Components } from "@alma/design-system";

import { EditorView, SidebarMenu, Explorer } from "@/components/organisms";

const { isOpen: isSettingsOpen } = storeToRefs(useSettingsStore());
const { navigatorWidth, isNavigatorShown } = storeToRefs(useEditorLayout());
const { setNavigatorWidth } = useEditorLayout();

const onUpdateWidth = (width: number) => {
  setNavigatorWidth(width);
};

const onOpenSettings = (): void => {};
</script>

<template>
  <Components.Atoms.Page class="editor-main-page" orientation="horizontal">
    <SidebarMenu @open:settings="onOpenSettings"></SidebarMenu>
    <Components.Atoms.ResizeBounding
      v-if="isNavigatorShown"
      class="editor-view__navigator"
      data-test="editor-navigator"
      :directions="'r'"
      :width="navigatorWidth"
      :min-width="Constants.DEFAULT_NAVIGATOR_MIN_WIDTH"
      :max-width="Constants.DEFAULT_NAVIGATOR_MAX_WIDTH"
      @update:width="onUpdateWidth"
    >
      <Explorer></Explorer>
    </Components.Atoms.ResizeBounding>
    <EditorView></EditorView>
  </Components.Atoms.Page>
  <Components.Molecules.Overlay v-model:is-open="isSettingsOpen">
    <Components.Atoms.Surface bordered>
      <Components.Atoms.Text>
        {{ "Settings" }}
      </Components.Atoms.Text>
    </Components.Atoms.Surface>
  </Components.Molecules.Overlay>
</template>

<style lang="scss">
.editor-main-page {
  box-sizing: border-box;
  position: relative;
}
</style>
