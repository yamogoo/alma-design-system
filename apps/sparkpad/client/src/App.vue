<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useTitle } from "@vueuse/core";

import { useAuthStore, useConfigStore, useLocaleStore } from "@/stores";

import { Constants } from "@/constants";

import {
  useAppLayout,
  useMeta,
  useTheme,
  useConnection,
} from "@alma/design-system";

const { $t } = storeToRefs(useLocaleStore());

useAppLayout("#app");
useTitle($t.value.about.title);
useMeta("description", $t.value.about.description);
useMeta("author", Constants.APP_AUTHOR_NAME);
useTheme("light", {
  selector: "html",
});
useConnection();

const { setLocale } = useLocaleStore();

const { initializeAuth } = useAuthStore();

useConfigStore();
setLocale("en");

onMounted(() => {
  void initializeAuth();
});

onBeforeUnmount(() => {
  stop();
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
