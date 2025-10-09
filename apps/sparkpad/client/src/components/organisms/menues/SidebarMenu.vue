<script setup lang="ts">
import { Components } from "@alma/design-system";

const emit = defineEmits<{
  (e: "open:settings"): void;
}>();

const onLogin = (): void => {
  emit("open:settings");
};

const onOpenSettings = (): void => {
  emit("open:settings");
};
</script>

<template>
  <Components.Organisms.NavigationRail
    class="sidebar-menu"
    :items="[]"
    :selected-item-index="1"
  >
    <template #header>
      <Components.Atoms.Logo></Components.Atoms.Logo>
    </template>
    <template #footer>
      <Components.Molecules.Group
        :variant="'block'"
        :mode="'neutral'"
        :tone="'canvas'"
        :size="'md'"
        :orientation="'vertical'"
      >
        <Components.Molecules.ControlButton
          :variant="'rounded'"
          :size="'md'"
          :mode="'neutral'"
          tone="primary"
          :icon-size="'lg'"
          :icon-name="'userThumbnail'"
          :icon-style="'outline'"
          :icon-weight="'300'"
          @press="onLogin"
        ></Components.Molecules.ControlButton>
        <Components.Molecules.ControlButton
          :variant="'rounded'"
          :size="'md'"
          :mode="'neutral'"
          tone="primary"
          :icon-size="'lg'"
          :icon-name="'cog'"
          :icon-style="'outline'"
          :icon-weight="'300'"
          @press="onOpenSettings"
        ></Components.Molecules.ControlButton>
      </Components.Molecules.Group>
    </template>
  </Components.Organisms.NavigationRail>
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
