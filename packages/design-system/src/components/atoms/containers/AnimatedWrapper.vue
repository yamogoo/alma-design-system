<script setup lang="ts">
import { nextTick, useTemplateRef, watch } from "vue";
import gsap from "gsap";

import { PREFIX, type AnimatedWrapperProps } from "./AnimatedWrapper";

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
  <div ref="root" :class="PREFIX">
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
