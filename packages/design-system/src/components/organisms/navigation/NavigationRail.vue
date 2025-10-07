<script setup lang="ts">
import Logo from "@/components/atoms/logos/Logo.vue";

import SimpleMenu from "@/components/atoms/menu/SimpleMenu.vue";
import Group from "@/components/atoms/containers/Group.vue";
import ControlButton from "@/components/atoms/buttons/ControlButton.vue";
import { type NavigationRailProps } from "@/components/organisms/navigation/NavigationRail";
import NavigationRailTemplate from "@/components/templates/navigation/NavigationRailTemplate.vue";

withDefaults(defineProps<NavigationRailProps>(), {});
</script>

<template>
  <NavigationRailTemplate :variant="'default'">
    <template #header>
      <slot name="header">
        <Group
          :size="'md'"
          :orientation="'vertical'"
          data-testid="navigation-rail-header"
        >
          <Logo></Logo>
        </Group>
      </slot>
    </template>
    <SimpleMenu
      v-if="items"
      :items="items"
      :selected-item-id="selectedItemId"
      orientation="vertical"
    ></SimpleMenu>
    <slot></slot>
    <template #footer>
      <slot name="footer">
        <Group
          :size="'md'"
          :orientation="'vertical'"
          data-testid="navigation-rail-footer"
        >
          <ControlButton
            :variant="'rounded'"
            :size="'md'"
            :mode="'neutral'"
            tone="primary"
            :icon-size="'md'"
            :icon-name="'cog'"
            :icon-style="'outline'"
            :icon-weight="'400'"
          ></ControlButton>
        </Group>
      </slot>
    </template>
  </NavigationRailTemplate>
</template>
