<script setup lang="ts">
import {
  NavigationRail,
  Group,
  Logo,
  ControlButton,
} from "@alma/design-system";

const emit = defineEmits<{
  (e: "open:settings"): void;
}>();

const onOpenSettings = (): void => {
  emit("open:settings");
};
</script>

<template>
  <NavigationRail class="sidebar-menu" :items="[]" :selected-item-index="1">
    <template #header>
      <Logo></Logo>
    </template>
    <template #footer>
      <Group
        :variant="'block'"
        :mode="'neutral'"
        :tone="'canvas'"
        :size="'md'"
        :orientation="'vertical'"
      >
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
