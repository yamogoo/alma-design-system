<script setup lang="ts">
import { onMounted, onUnmounted, nextTick, ref } from "vue";
import gsap from "gsap";

import type { SkeletonProps } from "@/components/atoms";

const props = withDefaults(defineProps<SkeletonProps>(), {
  mode: "neutral",
  tone: "primary",
  speed: 1,
});

const refShape = ref<HTMLDivElement | null>(null);
const ctx = gsap.context(() => {});
let ro: ResizeObserver | null = null;

const applyAnimation = (el: HTMLDivElement) => {
  const width = el.offsetWidth || el.getBoundingClientRect().width || 0;

  if (width === 0) {
    nextTick(() => applyAnimation(el));
    return;
  }

  gsap.killTweensOf(el);

  gsap.set(el, { xPercent: -50 });

  const base = 0.75;
  const duration = base / Math.max(props.speed, 0.01);

  gsap.fromTo(
    el,
    { x: -width },
    { x: width, duration, repeat: -1, ease: "none" }
  );
};

const onAnimate = (el: HTMLDivElement) => {
  ctx.add(() => applyAnimation(el));

  ro = new ResizeObserver(() => applyAnimation(el));
  ro.observe(el);
};

onMounted(() => {
  const el = refShape.value;
  if (!el) return;

  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mql.matches) return;

  onAnimate(el);
});

onUnmounted(() => {
  ro?.disconnect();
  gsap.killTweensOf(refShape.value);
  ctx.revert();
});
</script>

<template>
  <div
    class="skeleton"
    :class="[
      {
        [`skeleton_variant-${variant}`]: !!variant,
        [`skeleton_size-${size}`]: !!size,
      },
      `skeleton_mode-${mode}`,
      `skeleton_tone-${tone}`,
    ]"
    :aria-label="ariaLabel"
    :aria-busy="ariaBusy"
  >
    <div ref="refShape" class="skeleton__shape"></div>
  </div>
</template>

<style lang="scss">
@use "sass:map";

@mixin defineSizes($map: get($atoms, "skeleton")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $width: get($val, "root.width");
      $height: get($val, "root.height");
      $border-radius: px2rem(get($val, "root.border-radius"));

      &_variant-#{$variant} {
        &.skeleton_size-#{$size} {
          @include box($width, $height);
          @include maxBox($width, $height);
          border-radius: $border-radius;
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.atoms.skeleton")) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.skeleton_tone-#{$tone} {
          .skeleton__shape {
            @include themify($themes) {
              $background-in: themed(
                "atoms.skeleton.#{$mode}.#{$tone}.background-in"
              );
              $background-out: themed(
                "atoms.skeleton.#{$mode}.#{$tone}.background-out"
              );
              background: linear-gradient(
                90deg,
                $background-out,
                $background-in,
                $background-out
              );
            }
          }
        }
      }
    }
  }
}

.skeleton {
  position: relative;
  overflow: hidden;
  z-index: 1;
  cursor: wait;

  @include defineThemes();
  @include defineSizes();

  &__shape {
    position: absolute;
    inset: 0;
    z-index: 0;
    @extend %base-transition;
  }
}
</style>
