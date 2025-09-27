<script setup lang="ts">
import { storeToRefs } from "pinia";

import {
  DEFAULT_NAVIGATOR_MAX_WIDTH,
  DEFAULT_NAVIGATOR_MIN_WIDTH,
  useEditorLayout,
} from "@@/stores/useEditorLayout";

import { ResizeBounding } from "@/components/atoms";
import { Explorer } from "@@/components/organisms";

const { navigatorWidth, isNavigatorShown } = storeToRefs(useEditorLayout());
const { setNavigatorWidth } = useEditorLayout();

const onUpdateWidth = (width: number) => {
  setNavigatorWidth(width);
};

import { Page } from "@/components/atoms";
import { EditorView, SidebarMenu } from "@@/components/organisms";
</script>

<template>
  <Page class="editor-main-page" orientation="horizontal">
    <SidebarMenu></SidebarMenu>
    <ResizeBounding
      v-if="isNavigatorShown"
      class="editor-view__navigator"
      data-test="editor-navigator"
      :directions="'r'"
      :width="navigatorWidth"
      :min-width="DEFAULT_NAVIGATOR_MIN_WIDTH"
      :max-width="DEFAULT_NAVIGATOR_MAX_WIDTH"
      @update:width="onUpdateWidth"
    >
      <Explorer></Explorer>
    </ResizeBounding>
    <EditorView></EditorView>
  </Page>
</template>

<style lang="scss">
.editor-main-page {
  box-sizing: border-box;
  position: relative;
  padding: 12px 4px;
}
</style>
