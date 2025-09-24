<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useResizeObserver, useTitle } from "@vueuse/core";

import {
  useAuthStore,
  useConfigStore,
  useLayoutStore,
  useLocaleStore,
} from "@@/stores";

import { useMeta, useTheme, useConnection } from "@/composables/global";

import { Constants } from "@@/constants";

const { $t } = storeToRefs(useLocaleStore());

useTitle($t.value.about.title);
useMeta("description", $t.value.about.description);
useMeta("author", Constants.APP_AUTHOR_NAME);
useTheme("light", {
  selector: "html",
});
useConnection();

const { setAppSize } = useLayoutStore();
const { setLocale } = useLocaleStore();

const { initializeAuth } = useAuthStore();

useConfigStore();
setLocale("en");

const refApp = ref<HTMLDivElement | null>();

useResizeObserver(refApp, (entries) => {
  const entry = entries[0];
  const { width, height } = entry.contentRect;
  setAppSize({ width, height });
});

onMounted(() => {
  initializeAuth();
});
</script>

<template>
  <router-view></router-view>
</template>

<style lang="scss">
#app {
  position: relative;
  @include box(100vw, 100dvh);
  overflow: hidden;

  @include themify($themes) {
    background-color: themed("abstracts.surface.neutral.base");
  }
  @extend %base-transition;
}
</style>
