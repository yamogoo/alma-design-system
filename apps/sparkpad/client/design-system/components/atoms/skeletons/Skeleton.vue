<script setup lang="ts">
import { onMounted, ref } from "vue";
import g from "gsap";

import type { SkeletonProps } from "@/components/atoms";

withDefaults(defineProps<SkeletonProps>(), {
  mode: "default",
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
      duration: 0.75,
      repeat: -1,
    }
  );
};
</script>

<template>
  <div class="skeleton">
    <div
      ref="refShape"
      class="skeleton__shape"
      :class="[`input_mode-${String(mode)}`]"
    ></div>
  </div>
</template>

<style lang="scss">
@use "sass:map";

@mixin defineThemes($map: get($themes, "light.atoms.skeleton")) {
  @each $mode, $modes in $map {
    &_mode-#{$mode} {
      &.skeleton__shape {
        @include themify($themes) {
          $color-in: themed("atoms.skeleton.#{$mode}.color-in");
          $color-out: themed("atoms.skeleton.#{$mode}.color-out");
          background: linear-gradient(90deg, $color-out, $color-in, $color-out);
        }
      }
    }
  }
}

.skeleton {
  position: relative;
  border-radius: px2rem(get($roundness, "xs"));
  overflow: hidden;
  z-index: 1;
  cursor: wait;

  @include defineThemes();

  &__shape {
    position: absolute;
    inset: 0;
    z-index: 0;
    @extend %base-transition;
  }
}
</style>
