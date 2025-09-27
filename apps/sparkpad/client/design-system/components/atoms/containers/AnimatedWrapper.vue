<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import g from "gsap";

import type { AnimatedWrapperProps } from "@/components/atoms";

const PREFIX = "animated-wrapper";

const props = withDefaults(defineProps<AnimatedWrapperProps>(), {
  duration: 0.4,
});

const refWrapper = ref<HTMLElement>();

watch(
  () => props.contentKey,
  async () => {
    if (!refWrapper.value) return;

    const el = refWrapper.value;
    const prevHeight = el.offsetHeight;

    await nextTick();
    const newHeight = el.offsetHeight;

    const { duration } = props;

    g.fromTo(
      el,
      { height: prevHeight },
      {
        height: newHeight,
        duration,
        ease: "power4.out",
        onComplete: () => {
          nextTick(() => {
            el.style.height = "auto";
          });
        },
      }
    );
  }
);
</script>

<template>
  <div ref="refWrapper" :class="PREFIX">
    <slot></slot>
  </div>
</template>

<style lang="scss">
$prefix: animated-wrapper;

.#{$prefix} {
  position: relative;
}
</style>
