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
      <Components.Atoms.Group
        :direction="'forward'"
        :orientation="'horizontal'"
        :size="'md'"
      >
        <Components.Atoms.ToolbarBlock
          ><LanguageMenu></LanguageMenu
        ></Components.Atoms.ToolbarBlock>
        <Components.Atoms.ToolbarBlock
          ><ThemeSwitch></ThemeSwitch
        ></Components.Atoms.ToolbarBlock>
      </Components.Atoms.Group>
    </template>
  </Components.Templates.MainHeaderTemplate>
</template>
