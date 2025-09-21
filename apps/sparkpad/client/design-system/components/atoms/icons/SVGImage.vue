<script setup lang="ts">
import { defineAsyncComponent, computed } from "vue";

import { Skeleton, type SVGImageProps } from "@/components/atoms";

const props = defineProps<SVGImageProps>();

const modules = import.meta.glob("../../../assets/images/**/*.svg", {
  eager: false,
});

const symbol = computed(() => {
  const name = props.name;
  const path = `../../../assets/images/${name}.svg`;

  const loader = modules[path];
  if (!loader) {
    throw new Error(`SVG not found: ${path}`);
  }

  return defineAsyncComponent(loader as any);
});
</script>

<template>
  <div
    class="svg-image"
    data-testid="svg-image"
    :class="[
      {
        [`svg-image_size-${size}`]: !!size,
        [`svg-image_mode-${mode}`]: !!mode,
        [`svg-image_tone-${tone}`]: !!tone,
      },
    ]"
  >
    <Suspense>
      <component v-if="symbol" :is="symbol" viewBox="0 0 24 24"></component>
      <template #fallback>
        <Skeleton></Skeleton>
      </template>
    </Suspense>
  </div>
</template>

<style lang="scss">
@use "sass:map";

@mixin defineSizes($map: get($atoms, "icon")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $box-size: px2rem(get($val, "self.size"));

      &_variant-#{$variant} {
        &.icon_size-#{$size} {
          @include box($box-size);
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.abstracts.label")) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.svg-image_tone-#{$tone} {
          @include themify($themes) {
            fill: themed("abstracts.label.#{$mode}.#{$tone}");
          }
        }
      }
    }
  }
}

.svg-image {
  @include box(auto, inherit);
  line-height: 0;
  fill: inherit;
  @extend %base-transition;

  @include defineSizes();
  @include defineThemes();

  svg {
    @include box(auto, inherit);
    fill: inherit;
    @extend %base-transition;

    path {
      fill: inherit;
      @extend %base-transition;
    }
  }

  .skeleton {
    @include box(100%);
  }
}
</style>
