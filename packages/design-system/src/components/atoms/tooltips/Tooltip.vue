<script setup lang="ts">
import { onUnmounted, ref, useId, useTemplateRef, watch } from "vue";
import gsap from "gsap";
import { useFocus } from "@vueuse/core";

import { UIMODIFIERS } from "@/constants/ui";

import { useHover } from "@/composables/local/actions/useHover";
import { useTimeout } from "@/composables/local/timers/useTimeout";

import { TOOLTIP_PREFIX, type TooltipProps } from "./Tooltip";
import CharTooltipLabel from "@/components/atoms/tooltips/CharTooltipLabel.vue";

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

const refContent = useTemplateRef<HTMLDivElement | null>("content");

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
  if (!gsap) {
    done();
    return;
  }

  gsap.fromTo(
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
  if (!gsap) {
    done();
    return;
  }

  gsap.to(el, {
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
    :class="[
      TOOLTIP_PREFIX,
      isFollowingCursor
        ? `${TOOLTIP_PREFIX}_${UIMODIFIERS.FLOATING}`
        : `${TOOLTIP_PREFIX}_${UIMODIFIERS.ALIGN}-${align}`,
    ]"
  >
    <div
      ref="content"
      :class="`${TOOLTIP_PREFIX}__content`"
      :aria-describedby="localTooltipId"
    >
      <slot></slot>
    </div>
    <Transition :css="false" @enter="onTooltipEnter" @leave="onTooltipLeave">
      <CharTooltipLabel
        v-if="isTooltipShown"
        :class="`${TOOLTIP_PREFIX}__label`"
        :label="label"
        :id="localTooltipId"
        role="tooltip"
      ></CharTooltipLabel>
    </Transition>
  </div>
</template>

<style lang="scss">
$tokenName: "tooltip";
$prefix: getPrefix($tokenName);

.#{$prefix} {
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
      .#{$prefix}__label {
        left: 50%;
        transform: translateX(-50%);
      }
    }

    &-end {
      .#{$prefix}__label {
        right: 0;
      }
    }
  }
}
</style>
