gsap
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import gsap from "gsap";

import { createCustomEvent } from "@/utils";

import { usePageTransition } from "@/composables/local";

import type { PageProps } from "./Page";

const props = withDefaults(defineProps<PageProps>(), {
  isFooterShown: true,
  isDragging: false,
  useGlobalTransition: true,
  transitionInType: "fade",
  transitionOutType: "fade",
  tone: "primary",
  orientation: "vertical",
});

const emit = defineEmits<{
  (e: "anim-enter-completed"): void;
  (e: "anim-leave-completed"): void;
}>();

const refRoot = useTemplateRef<HTMLDivElement | null>("root");

const isMounted = ref(false);

const { transitionInType, transitionOutType } = usePageTransition({
  onBeforeRouterLeave: () => {
    isMounted.value = true;
    isMounted.value = false;
  },
});

const localTransitionInType = computed(() =>
  props.useGlobalTransition ? transitionInType.value : props.transitionInType
);
const localTransitionOutType = computed(() =>
  props.useGlobalTransition ? transitionOutType.value : props.transitionOutType
);

const defineControlAction = (): void => {
  document.dispatchEvent(
    createCustomEvent("control-action", {
      bubbles: true,
    })
  );
};

/* * * Animations * * */

const SCALE_OUT = 0.96;
const SCALE_DELAY_IN = 0.65;
const SCALE_DURATION_IN = 0.65;
const SCALE_DURATION_OUT = 0.65;

const MOVE_DURATION_IN = 0.75;
const MOVE_DURATION_OUT = 0.65;
const MOVE_DELAY_IN = 0.05;
const MOVE_DELAY_OUT = 0.1;

let tl: gsap.core.Timeline = gsap.timeline();

const clearTimeline = (el: Element): void => {
  gsap.set(el, { clearProps: "all" });
};

const onAnimEnter = (el: Element, done: () => void): void => {
  const { clientWidth: width, clientHeight: height } = el;

  switch (localTransitionInType.value) {
    case "fade":
      {
        clearTimeline(el);

        tl.fromTo(
          el,
          {
            scale: 0.85,
            opacity: 0,
          },
          {
            scale: 1.0,
            opacity: 1.0,
            ease: "power4.inout",
            duration: 0.35,
            delay: 0.35,
            onComplete: () => {
              emit("anim-enter-completed");
              done();
            },
          }
        );
      }
      break;
    case "bottom-to-top":
      {
        clearTimeline(el);

        tl.fromTo(
          el,
          {
            scale: SCALE_OUT,
          },
          {
            scale: 1,
            ease: "power4.out",
            delay: SCALE_DELAY_IN,
            duration: SCALE_DURATION_IN,
            onComplete: () => {
              emit("anim-enter-completed");
              done();
            },
          },
          0
        );

        tl.fromTo(
          el,
          {
            y: height,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            ease: "power4.in",
            delay: MOVE_DELAY_IN,
            duration: MOVE_DURATION_IN,
          },
          0
        );
      }
      break;
    case "top-to-bottom":
      {
        clearTimeline(el);

        tl.fromTo(
          el,
          {
            scale: SCALE_OUT,
          },
          {
            scale: 1,
            ease: "power4.out",
            delay: SCALE_DELAY_IN,
            duration: SCALE_DURATION_IN,
            onComplete: () => {
              emit("anim-enter-completed");
              done();
            },
          },
          0
        );

        tl.fromTo(
          el,
          {
            y: -height,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            ease: "power4.in",
            delay: MOVE_DELAY_IN,
            duration: MOVE_DURATION_IN,
          },
          0
        );
      }
      break;
    case "left-to-right":
      {
        clearTimeline(el);

        tl.fromTo(
          el,
          {
            scale: SCALE_OUT,
          },
          {
            scale: 1,
            ease: "power4.out",
            delay: SCALE_DELAY_IN,
            duration: SCALE_DURATION_IN,
            onComplete: () => {
              emit("anim-enter-completed");
              done();
            },
          },
          0
        );

        tl.fromTo(
          el,
          {
            x: -width,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            ease: "power4.in",
            delay: MOVE_DELAY_IN,
            duration: MOVE_DURATION_IN,
          },
          0
        );
      }

      break;
    case "right-to-left":
      {
        clearTimeline(el);

        tl.fromTo(
          el,
          {
            scale: SCALE_OUT,
          },
          {
            scale: 1,
            ease: "power4.out",
            delay: SCALE_DELAY_IN,
            duration: SCALE_DURATION_IN,
            onComplete: () => {
              emit("anim-enter-completed");
              done();
            },
          },
          0
        );

        tl.fromTo(
          el,
          {
            x: width,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            ease: "power4.in",
            duration: MOVE_DURATION_IN,
            delay: MOVE_DELAY_IN,
          },
          0
        );
      }
      break;
  }
};

const onAnimLeave = (el: Element, done: () => void): void => {
  const { clientWidth: width, clientHeight: height } = el;

  switch (localTransitionOutType.value) {
    case "fade":
      {
        clearTimeline(el);

        tl.to(el, {
          scale: 1.25,
          opacity: 0.0,
          ease: "power4.out",
          duration: 0.55,
          onComplete: () => {
            emit("anim-enter-completed");
            done();
          },
        });
      }
      break;
    case "top-to-bottom":
      {
        const tl = gsap.timeline();

        tl.to(
          el,
          {
            scale: SCALE_OUT,
            ease: "power4.out",
            duration: SCALE_DURATION_OUT,
          },
          0
        );

        tl.to(
          el,
          {
            y: height,
            opacity: 0,
            ease: "power4.in",
            delay: MOVE_DELAY_OUT,
            duration: MOVE_DURATION_OUT,
            onComplete: () => {
              emit("anim-enter-completed");
              done();
            },
          },
          0
        );
      }
      break;
    case "bottom-to-top":
      {
        const tl = gsap.timeline();

        tl.to(
          el,
          {
            scale: SCALE_OUT,
            ease: "power4.out",
            duration: SCALE_DURATION_OUT,
          },
          0
        );

        tl.to(
          el,
          {
            y: -height,
            opacity: 0,
            ease: "power4.in",
            delay: MOVE_DELAY_OUT,
            duration: MOVE_DURATION_OUT,
            onComplete: () => {
              emit("anim-enter-completed");
              done();
            },
          },
          0
        );
      }
      break;
    case "right-to-left":
      {
        const tl = gsap.timeline();

        tl.to(
          el,
          {
            scale: SCALE_OUT,
            ease: "power4.out",
            duration: SCALE_DURATION_OUT,
          },
          0
        );

        tl.to(
          el,
          {
            x: -width,
            opacity: 0,
            ease: "power4.in",
            delay: MOVE_DELAY_OUT,
            duration: MOVE_DURATION_OUT,
            onComplete: () => {
              emit("anim-enter-completed");
              done();
            },
          },
          0
        );
      }
      break;
    case "left-to-right":
      {
        const tl = gsap.timeline();

        tl.to(
          el,
          {
            scale: SCALE_OUT,
            ease: "power4.out",
            duration: SCALE_DURATION_OUT,
          },
          0
        );

        tl.to(
          el,
          {
            x: width,
            opacity: 0,
            ease: "power4.in",
            delay: MOVE_DELAY_OUT,
            duration: MOVE_DURATION_OUT,
            onComplete: () => {
              emit("anim-enter-completed");
              done();
            },
          },
          0
        );
      }
      break;
  }
};

const onFooterEnter = (el: Element, done: () => void): void => {
  const height = el.clientHeight;

  gsap.fromTo(
    el,
    {
      y: height,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      ease: "power4.out",
      duration: 0.35,
      onComplete: done,
    }
  );
};

const onFooterLeave = (el: Element, done: () => void): void => {
  const height = el.clientHeight;

  gsap.to(el, {
    y: height,
    opacity: 0,
    ease: "power4.out",
    duration: 0.35,
    onComplete: done,
  });
};

const onPointerDown = (): void => {
  defineControlAction();
  refRoot.value?.addEventListener("pointermove", defineControlAction);
  refRoot.value?.addEventListener("pointerup", defineControlAction);
};

onMounted(() => {
  isMounted.value = true;
});

onUnmounted(() => {
  refRoot.value?.removeEventListener("pointermove", defineControlAction);
  refRoot.value?.removeEventListener("pointerup", defineControlAction);
});
</script>

<template>
  <Transition :css="false" @enter="onAnimEnter" @leave="onAnimLeave">
    <div
      v-if="isMounted"
      ref="root"
      class="page"
      :class="[
        {
          [`page_orientation-${orientation}`]: !!orientation,
          [`page_mode-${tone}`]: !!tone,
        },
      ]"
      @pointerdown="onPointerDown"
    >
      <div v-if="$slots.header" class="page__header">
        <slot name="header"></slot>
      </div>
      <div class="page__body">
        <slot></slot>
      </div>
      <Transition :css="false" @enter="onFooterEnter" @leave="onFooterLeave">
        <div v-if="$slots.footer && isFooterShown" class="page__footer">
          <slot name="footer"></slot>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style lang="scss">
.page {
  box-sizing: border-box;
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @include box(100%);
  overflow: hidden;

  &_orientation {
    &-horizontal {
      .page__body {
        flex-direction: row;
      }
    }

    &-vertical {
      .page__body {
        flex-direction: column;
      }
    }
  }

  &__header {
    position: relative;
    width: 100%;
    margin: auto;
    pointer-events: none;
    z-index: 4;
  }

  &__body {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    @include box(100%);
    z-index: 3;
  }

  &__footer {
    position: relative;
    z-index: 4;
  }
}
</style>
