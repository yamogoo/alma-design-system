<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";

import { Constants } from "@/constants";

import { useConfigStore, useEditorSettings } from "@/stores";

import { List, ListItem, Switch, Slider, Dropdown } from "@alma/design-system";

const { currentTheme, isSystemThemeEnabled } = storeToRefs(useConfigStore());
const { toggleTheme, setIsSystemThemeEnabled } = useConfigStore();

const { fontSize, tabIdentSize, lineHeight } = storeToRefs(useEditorSettings());
const { setFontSize, setTabIdentSize, setLineHeight } = useEditorSettings();

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

const localFontSize = computed({
  get: () => {
    return fontSize.value;
  },
  set: (size: number) => {
    setFontSize(size);
  },
});

const localTabIdentSize = computed({
  get: () => {
    return tabIdentSize.value;
  },
  set: (size: number) => {
    setTabIdentSize(size);
  },
});

const localLineHeight = computed({
  get: () => {
    return lineHeight.value;
  },
  set: (size: number) => {
    setLineHeight(size);
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
        <Dropdown size="lg" :value="'English'"> </Dropdown>
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
        <Switch size="lg"></Switch>
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
        <Dropdown size="lg" :value="'Live preview'"> </Dropdown>
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
        <Slider
          size="lg"
          v-model:value="localFontSize"
          :min="Constants.EDITOR_FONT_MIN_SIZE"
          :max="Constants.EDITOR_FONT_MAX_SIZE"
        >
        </Slider>
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
        <Slider
          size="lg"
          v-model:value="localTabIdentSize"
          :min="Constants.EDITOR_MIN_TAB_IDENT_SIZE"
          :max="Constants.EDITOR_MAX_TAB_IDENT_SIZE"
        >
        </Slider>
      </template>
    </ListItem>
    <ListItem
      :id="'8'"
      mode="neutral"
      tone="canvas"
      :is-joined="true"
      :title="'Line height'"
    >
      <template #append>
        <Slider
          size="lg"
          v-model:value="localLineHeight"
          :min="Constants.EDITOR_MIN_LINE_HEIGHT"
          :max="Constants.EDITOR_MAX_LINE_HEIGHT"
        >
        </Slider>
      </template>
    </ListItem>
  </List>
</template>
