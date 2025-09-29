<script setup lang="ts">
import type { StoryBoxProps } from "./StoryBox";

withDefaults(defineProps<StoryBoxProps>(), {
  width: "320px",
  height: "240px",
});
</script>

<template>
  <div class="story-block" :style="{ width: `${width}`, height: `${height}` }">
    <slot></slot>
  </div>
</template>
