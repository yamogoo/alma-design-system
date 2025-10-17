<script setup lang="ts">
import { watch } from "vue";
import gsap from "gsap";

import { OVERLAY_PREFIX, type OverlayProps } from "./Overlay";

import Surface from "@/components/atoms/containers/Surface.vue";

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
      <Surface
        v-if="props.isOpen"
        :class="[OVERLAY_PREFIX]"
        :variant="variant"
        :size="size"
        :mode="mode"
        :tone="tone"
        :direction="direction"
        :orientation="orientation"
        :align-vertical="alignVertical"
        :align-horizontal="alignHorizontal"
        :stretch="stretch"
        :wrap="wrap"
        :border="border"
        :bordered="bordered"
        :rounded="rounded"
        @click.self="onClose"
      >
        <slot></slot>
      </Surface>
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

  :where(&) {
    z-index: 1000;
  }
}
</style>
