<script setup lang="ts">
import { Text } from "@/components/atoms";

import type { UIElementAlignment, UIElementOrientation } from "@/typings";

type InfoBlockAlignment = UIElementAlignment;

type InfoBlockOrientation = UIElementOrientation;

interface InfoBlockProps {
  title?: string;
  description?: string;
  align?: InfoBlockAlignment;
  orientation?: InfoBlockOrientation;
}

withDefaults(defineProps<InfoBlockProps>(), {
  orientation: "vertical",
  align: "start",
});
</script>

<template>
  <div class="sb-page-header">
    <Text
      v-if="title"
      :variant="'caption-1'"
      :mode="'neutral'"
      :tone="'primary'"
      >{{ title }}</Text
    >
    <Text
      v-if="description"
      :variant="'caption-2'"
      :mode="'neutral'"
      :tone="'secondary'"
      >{{ description }}</Text
    >
    <slot></slot>
  </div>
</template>

<style lang="scss">
.sb-page-header {
  display: flex;
  flex-direction: column;
  gap: px2rem(get($spacing, "xxs"));
  padding-bottom: px2rem(get($spacing, "xl"));
}
</style>
