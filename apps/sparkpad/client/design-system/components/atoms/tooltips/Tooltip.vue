<script setup lang="ts">
import { onUnmounted, ref, useId, watch } from "vue";
import { useFocus } from "@vueuse/core";
import g from "gsap";

import { useHover, useTimeout } from "@/composables/local";

import { CharTooltipLabel, type TooltipProps } from "@/components/atoms";

const FOCUS_SHOW_TOOLTIP_TIME_MS = 250,
  UNFOCUS_HIDE_TOOLTIP_TIME_MS = 750;

const TOOLTIP_OPACITY_IN = 1,
  TOOLTIP_OPACITY_OUT = 0,
  TOOLTIP_SCALE_IN = 1,
  TOOLTIP_SCALE_OUT = 0.9;

const TOOLTIP_DURATION_IN = 0.2,
  TOOLTIP_DURATION_OUT = 0.25;

const props = withDefaults(defineProps<TooltipProps>(), {
  align: "center",
  tooltipId: undefined,
  // !!not used yet
  isFollowingCursor: false,
});

const localTooltipId = props.tooltipId ?? useId();

const refContent = ref<HTMLDivElement | null>(null);

const isTooltipShown = ref(false);

const { isHovered: isContentHovered } = useHover(refContent);
const { focused: isContentFocused } = useFocus(refContent, {
  initialValue: false,
});

const focusTimer = useTimeout(() => {
  isTooltipShown.value = true;
}, FOCUS_SHOW_TOOLTIP_TIME_MS);

const unfocusTimer = useTimeout(() => {
  isTooltipShown.value = false;
}, UNFOCUS_HIDE_TOOLTIP_TIME_MS);

const stopTimers = (): void => {
  focusTimer.stop();
  unfocusTimer.stop();
};

watch([isContentHovered, isContentFocused], ([isHovered, isFocused]) => {
  stopTimers();

  isHovered || isFocused ? focusTimer.start() : unfocusTimer.start();
});

onUnmounted(() => {
  stopTimers();
});

/* * * Animations * * */

const onTooltipEnter = (el: Element, done: () => void): void => {
  g.fromTo(
    el,
    {
      opacity: TOOLTIP_OPACITY_OUT,
      scale: TOOLTIP_SCALE_OUT,
    },
    {
      opacity: TOOLTIP_OPACITY_IN,
      scale: TOOLTIP_SCALE_IN,
      duration: TOOLTIP_DURATION_IN,
      ease: "power4.out",
      onComplete: done,
    }
  );
};

const onTooltipLeave = (el: Element, done: () => void): void => {
  g.to(el, {
    opacity: TOOLTIP_OPACITY_OUT,
    scale: TOOLTIP_SCALE_OUT,
    duration: TOOLTIP_DURATION_OUT,
    ease: "power4.in",
    onComplete: done,
  });
};
</script>

<template>
  <div
    class="tooltip"
    :class="[
      isFollowingCursor ? `tooltip_follow-cursor` : `tooltip_align-${align}`,
    ]"
  >
    <div
      ref="refContent"
      class="tooltip__content"
      :aria-describedby="localTooltipId"
    >
      <slot></slot>
    </div>
    <Transition :css="false" @enter="onTooltipEnter" @leave="onTooltipLeave">
      <CharTooltipLabel
        v-if="isTooltipShown"
        class="tooltip__label"
        :label="label"
        role="tooltip"
      ></CharTooltipLabel>
    </Transition>
  </div>
</template>

<style lang="scss">
.tooltip {
  box-sizing: border-box;
  position: relative;

  &__label {
    position: absolute;
    z-index: 9999;
  }

  /* * * Modifiers * * */

  &_align {
    &-start {
      .tooltip__label {
        left: 0;
      }
    }

    &-center {
      .tooltip__label {
        left: 50%;
        transform: translateX(-50%);
      }
    }

    &-end {
      .tooltip__label {
        right: 0;
      }
    }
  }
}
</style>
