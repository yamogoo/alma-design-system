<script setup lang="ts">
import { Components } from "@alma/design-system";
</script>

<template>
  <div class="editor-view">
    <Components.Atoms.Surface
      class="editor-view__content"
      :as="'div'"
      bordered
      :variant="'default'"
      :size="'lg'"
      :mode="'neutral'"
      :tone="'primary'"
    >
      <Components.Atoms.Text :variant="'body-2'">
        {{ "Notes" }}
      </Components.Atoms.Text>
    </Components.Atoms.Surface>
  </div>
</template>

<style lang="scss">
.editor-view {
  position: relative;
  display: flex;
  @include box(100%);

  &__navigator {
    overflow: hidden;
  }

  &__content {
    flex: 1;
    overflow: hidden;
  }
}
</style>
