<script setup lang="ts">
import { ref, toValue, watch } from "vue";
import { Vue3Lottie as LottieAnimation } from "vue3-lottie";

import { ANIMATED_ICON_PREFIX, type AnimatedIconProps } from "./AnimatedIcon";

const props = withDefaults(defineProps<AnimatedIconProps>(), {
  variant: "default",
  speed: 1,
  loop: false,
});

const emit = defineEmits<{
  (e: "completed"): void;
}>();

const refAnim = ref<typeof LottieAnimation | null>(null);

const onAnimReady = (): void => {
  onToggle(props.isActive);
};

const onToggle = (isActive: boolean): void => {
  const el = toValue(refAnim);
  if (!el) return;

  if (!isActive) {
    el.pause();
    el.setDirection("reverse");
    el.play();
  } else {
    el.pause();
    el.setDirection("forward");
    el.play();
  }
};

const rendererSettings: typeof LottieAnimation.rendererSettings = {};

watch(
  () => props.isActive,
  (_isActive) => {
    onToggle(_isActive);
  }
);

const onCompleted = (): void => {
  emit("completed");
};
</script>

<template>
  <LottieAnimation
    ref="refAnim"
    class="animated-icon"
    :class="[
      {
        [`${ANIMATED_ICON_PREFIX}_variant-${variant}`]: !!variant,
        [`${ANIMATED_ICON_PREFIX}_size-${size}`]: !!size,
        [`${ANIMATED_ICON_PREFIX}_mode-${mode}`]: !!mode,
        [`${ANIMATED_ICON_PREFIX}_tone-${tone}`]: !!tone,
      },
    ]"
    :animation-data
    :auto-play="false"
    :loop
    :speed
    :renderer-settings
    @on-animation-loaded="onAnimReady"
    @on-complete="onCompleted"
  />
</template>

<style lang="scss">
$tokenName: "icon";
$themeTokenName: "label";
$prefix: getPrefix("animated-icon");

@mixin defineSizes($map: get($components, "atoms.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          $icon-size: px2rem(get($val, "root.size"));

          width: $icon-size !important;
          height: $icon-size !important;
        }
      }
    }
  }
}

@mixin defineThemes(
  $map: get($themes, "light.contracts.interactive.#{$themeTokenName}")
) {
  @each $mode, $modes in $map {
    @each $tone, $states in $modes {
      &_mode-#{$mode} {
        &.#{$prefix}_tone-#{$tone} {
          svg {
            path {
              @include themify($themes) {
                fill: themed(
                  "contracts.interactive.#{$themeTokenName}.#{$mode}.#{$tone}.normal"
                );
              }
            }
          }
        }
      }
    }
  }
}

.#{$prefix} {
  @include box(auto, inherit);
  line-height: 0;
  fill: currentColor;
  stroke: currentColor;
  @extend %base-transition;

  @include defineSizes();
  @include defineThemes();

  svg {
    @include box(auto, inherit);
    fill: currentColor;
    stroke: currentColor;
    @extend %base-transition;

    path {
      fill: currentColor;
      stroke: currentColor;
      @extend %base-transition;
    }
  }

  .skeleton {
    @include box(100%);
  }
}
</style>
