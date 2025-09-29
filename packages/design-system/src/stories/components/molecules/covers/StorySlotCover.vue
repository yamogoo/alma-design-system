<script setup lang="ts">
import { Text } from "@/components/atoms";

import type { StorySlotCoverProps } from "./StorySlotCover";

defineOptions({
  inheritAttrs: true,
});

withDefaults(defineProps<StorySlotCoverProps>(), {
  title: "Slot",
  description: "Place the subcomponent in the default slot",
});
</script>

<template>
  <div class="story-slot-cover">
    <template v-if="!$slots.default">
      <Text
        class="story-slot-cover__title"
        :variant="'label-3'"
        :mode="'accent'"
        :tone="'primary'"
        >{{ title }}</Text
      >
      <Text
        class="story-slot-cover__description"
        :variant="'caption-2'"
        :mode="'accent'"
        :tone="'primary'"
        >{{ description }}</Text
      >
    </template>
    <slot></slot>
  </div>
</template>

<style lang="scss">
.story-slot-cover {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: px2rem(get($spacing, "md"));
  @include box(100%);
  padding: px2rem(get($spacing, "xl"));
  background-image: url("../../../../assets/images/storybook/cutting-pattern.svg");
  background-repeat: repeat;
  background-size: px2rem(get($spacing, "lg"));
  @extend %base-transition;

  .text {
    text-align: center;
    @include themify($themes) {
      background-color: themed("abstracts.surface.neutral.primary");
    }
  }
}
</style>
