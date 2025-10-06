<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import gsap from "gsap";

import type { AnimatedWrapperProps } from "./AnimatedWrapper";

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

    gsap.fromTo(
      el,
      { height: prevHeight },
      {
        height: newHeight,
        duration,
        ease: "power4.out",
        onComplete: () => {
          void nextTick(() => {
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
