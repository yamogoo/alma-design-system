<script setup lang="ts">
import type { StoryGridProps } from "./StoryGrid";

withDefaults(defineProps<StoryGridProps>(), {
  columns: 1,
});
</script>

<template>
  <div class="sb-story-grid" :style="{ '--story-grid-cols': columns }">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.sb-story-grid {
  display: grid;
  grid-template-columns: repeat(var(--story-grid-cols), 1fr);
  gap: px2rem(get($spacing, "xxl"));
}
</style>
