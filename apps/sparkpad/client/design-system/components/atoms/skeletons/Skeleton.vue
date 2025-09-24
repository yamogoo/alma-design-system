<script setup lang="ts">
import { onMounted, ref } from "vue";
import g from "gsap";

import type { SkeletonProps } from "@/components/atoms";

const props = withDefaults(defineProps<SkeletonProps>(), {
  mode: "neutral",
  tone: "primary",
  speed: 1,
});
const refShape = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (refShape.value) onAnimate(refShape.value);
});

const onAnimate = (el: Element): void => {
  const width = el.clientWidth;

  g.fromTo(
    el,
    {
      x: -width,
    },
    {
      x: width,
      duration: 0.75 * props.speed,
      repeat: -1,
    }
  );
};
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
