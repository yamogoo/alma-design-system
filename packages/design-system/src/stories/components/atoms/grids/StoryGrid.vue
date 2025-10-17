<script setup lang="ts">
import { OVERLAY_IDS } from "@/constants/ui";

import type { StoryGridProps } from "./StoryGrid";

withDefaults(defineProps<StoryGridProps>(), {
  columns: 1,
});
</script>

<template>
  <div
    :id="OVERLAY_IDS.MAIN"
    class="sb-story-grid"
    :style="{ '--story-grid-cols': columns }"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss">
.sb-story-grid {
  display: grid;
  grid-template-columns: repeat(var(--story-grid-cols), 1fr);
  gap: px2rem(get($tokens, "spacing.xxl"));
}
</style>
