<script setup lang="ts">
import type { ToolbarBlockProps } from "./ToolbarBlock";

import { Group } from "@/components/atoms";

const PREFIX = "toolbar-block";

const props = withDefaults(defineProps<ToolbarBlockProps>(), {
  variant: "block",
  size: "md",
  mode: "neutral",
  tone: "primary",
});
</script>

<template>
  <Group :class="PREFIX" v-bind="props">
    <slot></slot>
  </Group>
</template>
