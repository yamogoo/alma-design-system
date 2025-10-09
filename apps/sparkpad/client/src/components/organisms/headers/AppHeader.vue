<script setup lang="ts">
import { Components } from "@alma/design-system";

import { LanguageMenu, ThemeSwitch, MainLogo } from "@/components/molecules";
import MainMenu from "@/components/organisms/menues/MainMenu.vue";
</script>

<template>
  <Components.Templates.MainHeaderTemplate
    class="app-header"
    data-testid="app-header"
  >
    <template #left>
      <MainLogo data-testid="app-header-logo"></MainLogo>
    </template>
    <MainMenu v-if="false" data-testid="app-header-menu"></MainMenu>
    <template #right>
      <Components.Molecules.Group
        :direction="'forward'"
        :orientation="'horizontal'"
        :size="'md'"
      >
        <Components.Molecules.ToolbarGroup
          ><LanguageMenu></LanguageMenu
        ></Components.Molecules.ToolbarGroup>
        <Components.Molecules.ToolbarGroup
          ><ThemeSwitch></ThemeSwitch
        ></Components.Molecules.ToolbarGroup>
      </Components.Molecules.Group>
    </template>
  </Components.Templates.MainHeaderTemplate>
</template>
