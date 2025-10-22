<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";

import { useConfigStore } from "@/stores";

import { ControlWrapper, Switch } from "@alma/design-system";

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
  <ControlWrapper class="theme-switch" :size="'md'">
    <!-- <AnimatedIcon
      :animation-data="Assets.Animations.themeIcon"
      :speed="1.33"
      :is-active="!isLightTheme"
      :size="'sm'"
      :mode="'neutral'"
      :tone="'primary'"
    ></AnimatedIcon> -->
    <Switch
      data-testid="theme-switch"
      :is-active="!isLightTheme"
      :is-disabled="false"
      :size="'sm'"
      aria-label="change-theme"
      @update:is-active="onChangeTheme"
    ></Switch>
  </ControlWrapper>
</template>
