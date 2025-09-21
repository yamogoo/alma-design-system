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
  <div
    class="sb-info-block"
    :class="[
      `sb-info-block_orientation-${orientation}`,
      `sb-info-block_align-${align}`,
    ]"
  >
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
.sb-info-block {
  display: flex;
  gap: px2rem(get($spacing, "md"));

  &_orientation {
    @include useOrientation();
  }

  &_align {
    @include useAlign();
  }
}
</style>
