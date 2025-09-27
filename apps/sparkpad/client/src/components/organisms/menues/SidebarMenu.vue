<script setup lang="ts">
import { ControlButton, Group, Logo } from "@/components/atoms";
import { NavigationRail } from "@/components/organisms";

const onLogin = (): void => {};

const onOpenSettings = (): void => {};
</script>

<template>
  <NavigationRail class="sidebar-menu" :items="[]" :selected-item-id="1">
    <template #header>
      <Logo></Logo>
    </template>
    <template #footer>
      <Group
        :variant="'block'"
        :mode="'neutral'"
        :tone="'ghost'"
        :size="'md'"
        :orientation="'vertical'"
      >
        <ControlButton
          :variant="'rounded'"
          :size="'md'"
          :mode="'neutral'"
          tone="primary"
          :icon-size="'lg'"
          :icon-name="'userThumbnail'"
          :icon-style="'outline'"
          :icon-weight="'300'"
          @press="onLogin"
        ></ControlButton>
        <ControlButton
          :variant="'rounded'"
          :size="'md'"
          :mode="'neutral'"
          tone="primary"
          :icon-size="'lg'"
          :icon-name="'cog'"
          :icon-style="'outline'"
          :icon-weight="'300'"
          @press="onOpenSettings"
        ></ControlButton>
      </Group>
    </template>
  </NavigationRail>
</template>

<style lang="scss">
.sidebar-menu {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 88px;
  height: 100%;
  padding: 12px 0px;
  gap: 24px;

  &__footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 24px;
  }
}
</style>
