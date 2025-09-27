<script setup lang="ts">
import { Text } from "@/components/atoms";
</script>

<template>
  <div class="editor-view">
    <div class="editor-view__content">
      <Text :variant="'body-2'">
        {{ "Notes" }}
      </Text>
    </div>
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
