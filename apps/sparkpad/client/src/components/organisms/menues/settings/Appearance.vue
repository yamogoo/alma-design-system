<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";

import { useConfigStore } from "@/stores";

import { List, ListItem, Switch, Slider, Dropdown } from "@alma/design-system";

const { currentTheme, isSystemThemeEnabled } = storeToRefs(useConfigStore());
const { toggleTheme, setIsSystemThemeEnabled } = useConfigStore();

const isLightTheme = ref(false);

const setSwitchState = (): void => {
  isLightTheme.value = currentTheme.value === "light";
};

watch(currentTheme, () => setSwitchState(), { immediate: true });

const onChangeTheme = () => toggleTheme();

const localIsSystemThemeEnabled = computed({
  get: () => {
    return isSystemThemeEnabled.value;
  },
  set: (value: boolean) => {
    setIsSystemThemeEnabled(value);
  },
});
</script>

<template>
  <List :is-selectable="false">
    <ListItem
      :id="'1'"
      mode="neutral"
      tone="canvas"
      :is-disabled="localIsSystemThemeEnabled"
      :is-joined="true"
      :title="'Theme'"
    >
      <template #append>
        <Switch
          :size="'lg'"
          :is-active="!isLightTheme"
          :is-disabled="localIsSystemThemeEnabled"
          aria-label="change-theme"
          @update:is-active="onChangeTheme"
        ></Switch>
      </template>
    </ListItem>
    <ListItem
      :id="'2'"
      mode="neutral"
      tone="canvas"
      :is-joined="true"
      :title="'Use system theme'"
      :description="'Depending on the time of day, a light or dark theme is automatically activated'"
    >
      <template #append>
        <Switch
          :size="'lg'"
          v-model:is-active="localIsSystemThemeEnabled"
          aria-label="change-system-theme"
        ></Switch>
      </template>
    </ListItem>
    <ListItem
      :id="'3'"
      mode="neutral"
      tone="canvas"
      :is-joined="true"
      :title="'Language'"
    >
      <template #append>
        <Dropdown :size="'lg'" :value="'English'"> </Dropdown>
      </template>
    </ListItem>
  </List>
  <List :is-selectable="false">
    <ListItem
      :id="'4'"
      mode="neutral"
      tone="canvas"
      :is-joined="true"
      :title="'Always focus new tabs'"
      :description="'If the option is disabled then when opening a new file the current tab will remain active'"
    >
      <template #append>
        <Switch :size="'lg'"></Switch>
      </template>
    </ListItem>
    <ListItem
      :id="'5'"
      mode="neutral"
      tone="canvas"
      :is-joined="true"
      :title="'Editing mode'"
    >
      <template #append>
        <Dropdown :size="'lg'" :value="'Live preview'"> </Dropdown>
      </template>
    </ListItem>
    <ListItem
      :id="'6'"
      mode="neutral"
      tone="canvas"
      :is-joined="true"
      :title="'Font size'"
    >
      <template #append>
        <Slider :size="'lg'" :value="50" :max="100"> </Slider>
      </template>
    </ListItem>
    <ListItem
      :id="'7'"
      mode="neutral"
      tone="canvas"
      :is-joined="true"
      :title="'Tab ident size'"
    >
      <template #append>
        <Slider :size="'lg'" :value="50" :max="100"> </Slider>
      </template>
    </ListItem>
  </List>
</template>
