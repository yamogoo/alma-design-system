<script setup lang="ts">
import { Group, ToolbarBlock } from "@/components/atoms";

import { MainHeader } from "@/components/templates";

import { LanguageMenu, ThemeSwitch, MainLogo } from "@@/components/moleculas";
import { MainMenu } from "@@/components/organisms";
</script>

<template>
  <MainHeader class="app-header" data-testid="app-header">
    <template #left>
      <MainLogo data-testid="app-header-logo"></MainLogo>
    </template>
    <MainMenu v-if="false" data-testid="app-header-menu"></MainMenu>
    <template #right>
      <Group :direction="'forward'" :orientation="'horizontal'" :size="'md'">
        <ToolbarBlock><LanguageMenu></LanguageMenu></ToolbarBlock>
        <ToolbarBlock><ThemeSwitch></ThemeSwitch></ToolbarBlock>
      </Group>
    </template>
  </MainHeader>
</template>
