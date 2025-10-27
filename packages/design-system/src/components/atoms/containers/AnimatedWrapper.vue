<script setup lang="ts">
import { nextTick, useTemplateRef, watch } from "vue";
import gsap from "gsap";

import {
  ANIMATED_WRAPPER_PREFIX,
  type AnimatedWrapperProps,
} from "./AnimatedWrapper";

const props = withDefaults(defineProps<AnimatedWrapperProps>(), {
  duration: 0.4,
});

const refWrapper = useTemplateRef<HTMLDivElement | null>("root");

watch(
  () => props.contentKey,
  async () => {
    if (!refWrapper.value) return;

    const el = refWrapper.value;
    const prevHeight = el.offsetHeight;

    await nextTick();
    const newHeight = el.offsetHeight;

    const { duration } = props;

    if (!gsap) {
      el.style.height = `${newHeight}px`;
      void nextTick(() => {
        el.style.height = "auto";
      });
      return;
    }

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
  <div ref="root" :class="ANIMATED_WRAPPER_PREFIX">
    <slot></slot>
  </div>
</template>

<style lang="scss">
$tokenName: "animated-wrapper";
$prefix: getPrefix($tokenName);

.#{$prefix} {
  position: relative;
}
</style>
