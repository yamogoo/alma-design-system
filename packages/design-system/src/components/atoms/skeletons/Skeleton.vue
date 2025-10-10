<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";
import gsap from "gsap";

import {
  SKELETON_PREFIX,
  type SkeletonProps,
} from "@/components/atoms/skeletons/Skeleton";

const props = withDefaults(defineProps<SkeletonProps>(), {
  mode: "neutral",
  tone: "primary",
  speed: 1,
});
const refShape = useTemplateRef<HTMLDivElement | null>("shape");

const ariaLabel = "skeleton";
const ariaBusy = "true";

onMounted(() => {
  if (refShape.value) onAnimate(refShape.value);
});

const onAnimate = (el: Element): void => {
  const width = el.clientWidth;

  gsap.fromTo(
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
    :class="[
      SKELETON_PREFIX,
      {
        [`${SKELETON_PREFIX}_variant-${variant}`]: !!variant,
        [`${SKELETON_PREFIX}_size-${size}`]: !!size,
      },
      `${SKELETON_PREFIX}_mode-${mode}`,
      `${SKELETON_PREFIX}_tone-${tone}`,
    ]"
    :data-testid="`${SKELETON_PREFIX}`"
    :aria-label="ariaLabel"
    :aria-busy="ariaBusy"
  >
    <div ref="shape" :class="`${SKELETON_PREFIX}__shape`"></div>
  </div>
</template>

<style lang="scss">
$tokenName: "skeleton";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "atoms.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $width: get($val, "root.width");
      $height: get($val, "root.height");
      $border-radius: px2rem(get($val, "root.border-radius"));

      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          @include box($width, $height);
          @include maxBox($width, $height);
          border-radius: $border-radius;
        }
      }
    }
  }
}

@mixin defineThemes(
  $map: get($themes, "light.components.atoms.#{$tokenName}")
) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.#{$prefix}_tone-#{$tone} {
          .#{$prefix}__shape {
            @include themify($themes) {
              $background-in: themed(
                "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.background-in"
              );
              $background-out: themed(
                "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.background-out"
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

.#{$prefix} {
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
