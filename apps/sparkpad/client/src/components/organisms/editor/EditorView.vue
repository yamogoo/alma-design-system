<script setup lang="ts">
import { Stack, Surface, Text } from "@alma/design-system";
</script>

<template>
  <Stack class="editor-view" variant="default" size="lg" :padding="['l', 'v']">
    <Surface
      class="editor-view__content"
      as="div"
      bordered
      variant="default"
      size="lg"
      mode="neutral"
      tone="canvas"
      orientation="horizontal"
      align-horizontal="center"
      align-vertical="center"
    >
      <Text variant="body-2" mode="neutral" tone="primary">
        {{ "Notes" }}
      </Text>
    </Surface>
  </Stack>
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
