<script setup lang="ts">
import type { ToolbarBlockProps } from "./ToolbarBlock";

import { Group } from "@/components/atoms";

const props = withDefaults(defineProps<ToolbarBlockProps>(), {
  variant: "block",
  size: "md",
  mode: "neutral",
  tone: "primary",
});
</script>

<template>
  <Group class="toolbar-block" v-bind="props">
    <slot></slot>
  </Group>
</template>
