<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useResizeObserver, useTitle } from "@vueuse/core";
import type { ResizeObserverCallback } from "@vueuse/core";

import {
  useAuthStore,
  useConfigStore,
  useLayoutStore,
  useLocaleStore,
} from "@/stores";

import { Constants } from "@/constants";

import { Composables } from "@alma/design-system";
import { debounce } from "lodash-es";

const { $t } = storeToRefs(useLocaleStore());

useTitle($t.value.about.title);
Composables.Global.useMeta("description", $t.value.about.description);
Composables.Global.useMeta("author", Constants.APP_AUTHOR_NAME);
Composables.Global.useTheme("light", {
  selector: "html",
});
Composables.Global.useConnection();

const { setAppSize } = useLayoutStore();
const { setLocale } = useLocaleStore();

const { initializeAuth } = useAuthStore();

useConfigStore();
setLocale("en");

const refApp = ref<HTMLDivElement | null>();

const updateSize = debounce((entries: readonly ResizeObserverEntry[]) => {
  const entry = entries[0];
  const { width, height } = entry.contentRect;
  setAppSize({ width, height });
}, 150);

const stop = () =>
  useResizeObserver(refApp, updateSize as unknown as ResizeObserverCallback);

onMounted(async () => {
  void initializeAuth();

  await nextTick();
  const el = refApp.value;
  if (el) {
    const { width, height } = el.getBoundingClientRect();
    setAppSize({ width, height });
  }
});

onBeforeUnmount(() => {
  stop();
  updateSize.cancel();
});
</script>

<template>
  <RouterView></RouterView>
</template>

<style lang="scss">
#app {
  position: relative;
  @include box(100vw, 100dvh);
  overflow: hidden;

  @include useThemeTransition();

  @include themify($themes) {
    background-color: themed(
      "components.main.app.neutral.secondary.root.background"
    );
  }
}
</style>
