<script setup lang="ts">
import { MainHeaderTemplate, Group, ToolbarGroup } from "@alma/design-system";

import { LanguageMenu, ThemeSwitch, MainLogo } from "@/components/molecules";
import MainMenu from "@/components/organisms/menues/MainMenu.vue";
</script>

<template>
  <MainHeaderTemplate class="app-header" data-testid="app-header">
    <template #left>
      <MainLogo data-testid="app-header-logo"></MainLogo>
    </template>
    <MainMenu v-if="false" data-testid="app-header-menu"></MainMenu>
    <template #right>
      <Group :direction="'forward'" :orientation="'horizontal'" :size="'md'">
        <ToolbarGroup><LanguageMenu></LanguageMenu></ToolbarGroup>
        <ToolbarGroup><ThemeSwitch></ThemeSwitch></ToolbarGroup>
      </Group>
    </template>
  </MainHeaderTemplate>
</template>
