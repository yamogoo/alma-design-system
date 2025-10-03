<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useResizeObserver, useTitle } from "@vueuse/core";

import {
  useAuthStore,
  useConfigStore,
  useLayoutStore,
  useLocaleStore,
} from "@/stores";

import { Constants } from "@/constants";

import { Composables } from "@alma/design-system";

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

useResizeObserver(refApp, (entries) => {
  const entry = entries[0];
  const { width, height } = entry.contentRect;
  setAppSize({ width, height });
});

onMounted(() => {
  void initializeAuth();
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

  @include themify($themes) {
    background-color: themed(
      "contracts.interactive.surface.neutral.primary.normal"
    );
  }
  @extend %base-transition;
}
</style>
