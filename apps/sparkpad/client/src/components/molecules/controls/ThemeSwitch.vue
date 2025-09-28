<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";

import { useConfigStore } from "@/stores";

import { Assets, Components } from "@alma/design-system";

const { currentTheme } = storeToRefs(useConfigStore());
const { toggleTheme } = useConfigStore();

const isLightTheme = ref(false);

const setSwitchState = (): void => {
  isLightTheme.value = currentTheme.value === "light";
};

watch(currentTheme, () => setSwitchState(), { immediate: true });

const onChangeTheme = () => toggleTheme();
</script>

<template>
  <Components.Atoms.ControlWrapper class="theme-switch" :size="'md'">
    <Components.Atoms.AnimatedIcon
      :animation-data="Assets.Animations.themeIcon"
      :speed="1.33"
      :is-active="!isLightTheme"
      :size="'sm'"
      :mode="'neutral'"
      :tone="'disabled'"
    ></Components.Atoms.AnimatedIcon>
    <Components.Atoms.Switch
      data-testid="theme-switch"
      :is-active="!isLightTheme"
      :is-disabled="false"
      :size="'sm'"
      aria-label="change-theme"
      @update:is-active="onChangeTheme"
    ></Components.Atoms.Switch>
  </Components.Atoms.ControlWrapper>
</template>
