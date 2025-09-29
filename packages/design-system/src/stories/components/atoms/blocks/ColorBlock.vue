<script setup lang="ts">
import { computed, type ComputedRef, type CSSProperties } from "vue";

import type { ColorBlockProps } from "./ColorBlock";
import { Text } from "@/components/atoms";

const props = defineProps<ColorBlockProps>();

const computedStyle: ComputedRef<CSSProperties> = computed(() => {
  return {
    backgroundColor: props.colorValue,
  };
});
</script>

<template>
  <div class="color-block">
    <div class="color-block__header">
      <Text
        v-if="name"
        class="color-block__header-name"
        :variant="'caption-1'"
        :mode="'neutral'"
        :tone="'primary'"
        :value="name"
      ></Text>
      <Text
        v-if="name"
        class="color-block__header-color"
        :variant="'caption-1'"
        :mode="'neutral'"
        :tone="'tertiary'"
        :value="colorValue"
      ></Text>
    </div>
    <div class="color-block__color" :style="computedStyle"></div>
  </div>
</template>

<style lang="scss">
.color-block {
  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: px2rem(get($roundness, "xs"));
  }

  &__color {
    @include box(100%, px2rem(48px));
    border-radius: px2rem(get($roundness, "xs"));
  }
}
</style>
