<script setup lang="ts">
import { defineAsyncComponent, computed } from "vue";

import { UIFACETS } from "@/constants/ui";

import { SVG_IMAGE_PREFIX, type SVGImageProps } from "./SVGImage";

import Skeleton from "@/components/atoms/skeletons/Skeleton.vue";

const props = withDefaults(defineProps<SVGImageProps>(), {
  variant: "default",
  ariaLabel: "image",
});

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
  return defineAsyncComponent(loader as any);
});
</script>

<template>
  <div
    data-testid="svg-image"
    :class="[
      SVG_IMAGE_PREFIX,
      {
        [`${SVG_IMAGE_PREFIX}_${UIFACETS.VARIANT}-${variant}`]: !!variant,
        [`${SVG_IMAGE_PREFIX}_${UIFACETS.SIZE}-${size}`]: !!size,
        [`${SVG_IMAGE_PREFIX}_${UIFACETS.MODE}-${mode}`]: !!mode,
        [`${SVG_IMAGE_PREFIX}_${UIFACETS.TONE}-${tone}`]: !!tone,
      },
    ]"
    role="img"
    :aria-label="ariaLabel"
    :aria-hidden="ariaHidden"
  >
    <Suspense>
      <component :is="symbol" v-if="symbol" viewBox="0 0 24 24"></component>
      <template #fallback>
        <Skeleton></Skeleton>
      </template>
    </Suspense>
  </div>
</template>

<style lang="scss">
$tokenName: "icon";
$themeTokenName: "label";
$prefix: getPrefix("svg-image");

@mixin defineSizes($map: get($components, "atoms.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $box-size: px2rem(get($val, "root.size"));

      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          @include box($box-size);
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
