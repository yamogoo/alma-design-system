<script setup lang="ts">
import {
  onMounted,
  onUnmounted,
  nextTick,
  ref,
  computed,
  watch,
  useTemplateRef,
} from "vue";
import gsap from "gsap";

import { px2rem } from "@/utils/px2rem";

import {
  CAROUSEL_STACK_PREFIX,
  type CarousleStackProps,
} from "./CarouselStack";

const props = withDefaults(defineProps<CarousleStackProps>(), {
  variant: "default",
  orientation: "vertical",
  direction: "forward",
  stretch: "fill",
  duration: 0.55,
  screenCount: 1,
  autoPlay: false,
  interval: 3,
  selectedScreenId: 0,
  size: "md",
  isInactiveItemUnmounted: false,
  isDruggable: false,
  editScale: 1,
  gap: 0,
  isItemsClickable: true,
});

const emit = defineEmits<{
  (e: "update:selected-screen-id", selectedScreenId: number): void;
}>();

const AUTOPLAY_DELAY_CORRECTION = 200,
  SWIPE_THRESHOLD_RATIO = 0.1;

const ANIMATION_FADE_DURATION = 0.15;

const refRoot = useTemplateRef<HTMLDivElement | null>("root");
const refTrack = useTemplateRef<HTMLDivElement | null>("track");

const screenSize = computed(() => {
  const orientation = props.orientation;
  const width = refRoot.value?.clientWidth;
  const height = refRoot.value?.clientHeight;

  return orientation === "vertical" ? height : width;
});

const currentSid = ref(props.selectedScreenId);
const autoplayTimer = ref<ReturnType<typeof setInterval> | null>(null);

const startAutoPlay = () => {
  stopAutoPlay();
  if (!props.autoPlay) return;

  autoplayTimer.value = setInterval(
    () => {
      const count = props.screenCount || 1;

      let next =
        props.direction === "backward"
          ? (currentSid.value - 1 + count) % count
          : (currentSid.value + 1) % count;

      currentSid.value = next;
    },
    (props.interval || 1) * 1000 + AUTOPLAY_DELAY_CORRECTION
  );
};

const stopAutoPlay = () => {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value);
    autoplayTimer.value = null;
  }
};

watch(currentSid, (idx) => {
  onAnimate(idx);
  emit("update:selected-screen-id", idx);
});

/* * * Touch Actions * * */

const isDragging = ref(false);
const startCoord = ref(0);
const delta = ref(0);
const clickStartTime = ref(0);

const itemGap = computed(() => props.gap ?? 0);
const containerGap = computed(() => `${px2rem(props.gap)}rem`);
const itemFullSize = computed(() => (screenSize.value ?? 0) + itemGap.value);
const trackOffset = (selectedScreenId: number) =>
  -selectedScreenId * itemFullSize.value +
  (screenSize.value ?? 0) / 2 -
  (screenSize.value ?? 0) / 2;

const updateItemsScale = () => {
  if (!refTrack.value) return;
  const children = Array.from(refTrack.value.children) as HTMLElement[];
  const scale = props.isDruggable ? (props.editScale ?? 1) : 1;

  children.forEach((el) => {
    gsap.to(el, {
      scale,
      duration: props.duration,
      ease: "power4.out",
      transformOrigin: "center center",
    });
  });
};

const onPointerDown = (e: PointerEvent) => {
  if (!props.isDruggable || !refTrack.value) return;

  isDragging.value = true;
  startCoord.value = props.orientation === "vertical" ? e.clientY : e.clientX;
  clickStartTime.value = performance.now();

  stopAutoPlay();
  refTrack.value.setPointerCapture(e.pointerId);
};

const onPointerMove = (e: PointerEvent) => {
  if (!props.isDruggable || !isDragging.value || !refTrack.value) return;

  const currentCoord = props.orientation === "vertical" ? e.clientY : e.clientX;

  delta.value = currentCoord - startCoord.value;
  const moveOffset = trackOffset(currentSid.value) + delta.value;

  gsap.set(refTrack.value, {
    [props.orientation === "vertical" ? "y" : "x"]: moveOffset,
  });
};

const onPointerUp = () => {
  if (!props.isDruggable || !isDragging.value) return;
  isDragging.value = false;

  const distance = Math.abs(delta.value);
  const threshold = (screenSize.value ?? 0) * SWIPE_THRESHOLD_RATIO;

  if (distance > threshold) {
    const direction = delta.value > 0 ? -1 : 1;
    const count = props.screenCount || 1;
    const next = Math.max(0, Math.min(count - 1, currentSid.value + direction));
    currentSid.value = next;
  }

  delta.value = 0;
  onAnimate(currentSid.value);

  if (props.autoPlay) startAutoPlay();
};

const isCursorGrabbing = computed(() => props.isDruggable && isDragging.value);

watch(
  () => props.isDruggable,
  () => {
    updateItemsScale();
  }
);

/* * * Animation * * */

const onAnimate = (idx: number, duration = props.duration): void => {
  const el = refTrack.value;

  const offset = -(screenSize.value ?? 0) * idx - props.gap * idx;

  if (el) {
    gsap.to(el, {
      ...(props.orientation === "vertical" ? { y: offset } : { x: offset }),
      duration,
      ease: "power4.out",
    });
  }
};

watch(
  () => props.selectedScreenId,
  (idx) => {
    onAnimate(idx);
  }
);

watch(
  () => props.selectedScreenId,
  (idx) => {
    if (!props.autoPlay) {
      currentSid.value = idx;
    }
  },
  {
    immediate: true,
  }
);

watch(
  () => props.autoPlay,
  (newVal) => {
    if (newVal) startAutoPlay();
    else stopAutoPlay();
  }
);

onMounted(async () => {
  await nextTick();

  onAnimate(currentSid.value, 0);
  startAutoPlay();
  updateItemsScale();

  refTrack.value?.addEventListener("pointerdown", onPointerDown);
  refTrack.value?.addEventListener("pointermove", onPointerMove);
  refTrack.value?.addEventListener("pointerup", onPointerUp);
  refTrack.value?.addEventListener("pointercancel", onPointerUp);
  refTrack.value?.addEventListener("pointerleave", onPointerUp);
});

onUnmounted(() => {
  stopAutoPlay();
  refTrack.value?.removeEventListener("pointerdown", onPointerDown);
  refTrack.value?.removeEventListener("pointermove", onPointerMove);
  refTrack.value?.removeEventListener("pointerup", onPointerUp);
  refTrack.value?.removeEventListener("pointercancel", onPointerUp);
  refTrack.value?.removeEventListener("pointerleave", onPointerUp);
});

/* * * Animations * * */

const onEnter = (el: Element, done: () => void): void => {
  gsap.fromTo(
    el,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      ease: "power4.out",
      duration: ANIMATION_FADE_DURATION,
      onComplete: done,
    }
  );
};

const onLeave = (el: Element, done: () => void): void => {
  gsap.to(el, {
    opacity: 0,
    ease: "power4.out",
    duration: ANIMATION_FADE_DURATION,
    onComplete: done,
  });
};
</script>

<template>
  <div
    ref="root"
    :class="[
      CAROUSEL_STACK_PREFIX,
      `${CAROUSEL_STACK_PREFIX}_variant-${variant}`,
      {
        [`${CAROUSEL_STACK_PREFIX}_size-${String(size)}`]: size!!,
        [`${CAROUSEL_STACK_PREFIX}_orientation-${orientation}`]: orientation,
        [`${CAROUSEL_STACK_PREFIX}_stretch-${stretch}`]: stretch,
        [`${CAROUSEL_STACK_PREFIX}_grabbing`]: isCursorGrabbing,
      },
      `${CAROUSEL_STACK_PREFIX}_${isItemsClickable ? 'clickable' : 'static'}`,
    ]"
  >
    <div
      v-if="$slots.pagination"
      :class="`${CAROUSEL_STACK_PREFIX}__header`"
      :data-testid="`${CAROUSEL_STACK_PREFIX}__header`"
    >
      <slot
        name="pagination"
        :selectedScreenId="selectedScreenId"
        :screenCount="screenCount"
      ></slot>
    </div>
    <div
      ref="track"
      :class="`${CAROUSEL_STACK_PREFIX}__container`"
      :style="{ gap: containerGap }"
    >
      <template v-for="idx in screenCount" :key="idx">
        <Transition :css="false" @enter="onEnter" @leave="onLeave">
          <div
            v-if="isInactiveItemUnmounted ? idx - 1 === selectedScreenId : true"
            :class="`${CAROUSEL_STACK_PREFIX}__screen`"
            :style="{ flex: `0 0 ${screenSize}px` }"
          >
            <slot
              :name="`screen-${idx}`"
              v-bind="{ idx: idx + 1, isActive: idx - 1 === selectedScreenId }"
            ></slot>
          </div>
        </Transition>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
@use "sass:map";

$tokenName: "carousel-stack";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "atoms.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $header-padding: get($val, "header.padding");

      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          .#{$prefix}__header {
            padding: $header-padding;
          }
        }
      }
    }
  }
}

.#{$prefix} {
  position: relative;
  @include defineSizes();

  &__container {
    position: relative;
    display: flex;
    @include box(100%);
  }

  &_stretch {
    &-fill {
      @include box(100%);
    }

    &-auto {
      &.#{$prefix}_orientation {
        &-vertical {
          @include box(auto, 100%);
        }

        &-horizontal {
          @include box(100%, auto);
        }
      }
    }
  }

  &_clickable {
    cursor: pointer;
  }

  &_static {
    .#{$prefix}__screen {
      user-select: none;
      pointer-events: none;
    }
  }

  &_grabbing {
    cursor: grabbing;
  }

  &_orientation {
    &-vertical {
      .#{$prefix}__container {
        flex-direction: column;
      }
    }

    &-horizontal {
      .#{$prefix}__container {
        flex-direction: row;
      }
    }
  }

  &__header {
    position: absolute;
    top: 0;
    right: 0;
  }

  &__screen {
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    @include box(100%);
  }
}
</style>
