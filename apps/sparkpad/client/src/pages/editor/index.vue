<script setup lang="ts">
import { storeToRefs } from "pinia";

import { Constants } from "@/constants";

import { useEditorLayout } from "@/stores/useEditorLayout";

import { Components } from "@alma/design-system";
import { Explorer } from "@/components/organisms";

const { navigatorWidth, isNavigatorShown } = storeToRefs(useEditorLayout());
const { setNavigatorWidth } = useEditorLayout();

const onUpdateWidth = (width: number) => {
  setNavigatorWidth(width);
};

import { EditorView, SidebarMenu } from "@/components/organisms";
</script>

<template>
  <Components.Atoms.Page class="editor-main-page" orientation="horizontal">
    <SidebarMenu></SidebarMenu>
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
</template>

<style lang="scss">
.editor-main-page {
  box-sizing: border-box;
  position: relative;
}
</style>
