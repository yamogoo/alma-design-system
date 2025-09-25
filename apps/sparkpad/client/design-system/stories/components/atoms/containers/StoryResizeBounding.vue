<script setup lang="ts">
import {
  Text,
  ResizeBounding,
  type ResizeBoundingProps,
} from "@/components/atoms";

interface LocalProps extends ResizeBoundingProps {}

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<LocalProps>();

interface EmittedFocusData {
  state: boolean;
  direction: string;
}

const emit = defineEmits<{
  (e: "update:width", width: number): void;
  (e: "update:height", height: number): void;
  (e: "drag:start", dir: string): void;
  (e: "drag:move", dir: string): void;
  (e: "drag:end", dir: string): void;
  (e: "focus", data: EmittedFocusData): void;
}>();
</script>

<template>
  <ResizeBounding
    v-bind="props"
    @update:width="(width: number) => emit('update:width', width)"
    @update:height="(height: number) => emit('update:height', height)"
    @drag:start="(dir: string) => emit('drag:start', dir)"
    @drag:move="(dir: string) => emit('drag:move', dir)"
    @drag:end="(dir: string) => emit('drag:end', dir)"
    @focus="(args: EmittedFocusData) => emit('focus', args)"
  >
    <template #knob>
      <slot name="knob"></slot>
    </template>
    <div class="resize-bounding-content">
      <Text :variant="'label-3'" :mode="'accent'" :tone="'primary'">Slot</Text>
      <Text :variant="'caption-2'" :mode="'accent'" :tone="'primary'"
        >Place the subcomponent in the default slot</Text
      >
    </div>
  </ResizeBounding>
</template>

<style lang="scss">
.resize-bounding-content {
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

  .text {
    text-align: center;
    @include themify($themes) {
      background-color: themed("abstracts.surface.neutral.primary");
    }
  }
}
</style>
