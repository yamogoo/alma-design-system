<script setup lang="ts">
import { watch } from "vue";
import gsap from "gsap";

import { OVERLAY_PREFIX, type OverlayProps } from "./Overlay";

const props = withDefaults(defineProps<OverlayProps>(), {
  containerId: "body",
  variant: "default",
  durationIn: 0.25,
  durationOut: 0.25,
});

const emit = defineEmits<{
  (e: "enter:started"): void;
  (e: "enter:completed"): void;
  (e: "leave:completed"): void;
  (e: "close"): void;
}>();

watch(
  () => props.isOpen,
  (newValue, prevValue) => {
    if (prevValue && !newValue) emit("close");
  }
);

const onClose = (): void => {
  emit("close");
};

/* * * Animation * * */

const onEnter = (el: Element, done: () => void): void => {
  emit("enter:started");

  gsap.killTweensOf?.(el);
  gsap.fromTo(
    el,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      ease: "power4.out",
      duration: props.durationIn,
      onComplete: () => {
        emit("enter:completed");
        done();
      },
    }
  );
};

const onLeave = (el: Element, done: () => void): void => {
  gsap.killTweensOf?.(el);
  gsap.to(el, {
    opacity: 0,
    ease: "power4.out",
    duration: props.durationOut,
    onComplete: () => {
      emit("leave:completed");
      done();
    },
  });
};
</script>

<template>
  <Teleport :to="containerId">
    <Transition :css="false" @enter="onEnter" @leave="onLeave">
      <div v-if="props.isOpen" :class="[OVERLAY_PREFIX]" @click.self="onClose">
        <slot></slot>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
$tokenName: "overlay";
$prefix: getPrefix($tokenName);

.#{$prefix} {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  inset: 0;
  @include themify($themes) {
    background: themed("contracts.rel.overlay.neutral.base");
  }

  :where(&) {
    z-index: 1000;
  }
}
</style>
