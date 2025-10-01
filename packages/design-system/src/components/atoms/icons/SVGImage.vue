<script setup lang="ts">
import { defineAsyncComponent, computed } from "vue";

import { Skeleton, type SVGImageProps } from "@/components/atoms";

const PREFIX = "svg-image";

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return defineAsyncComponent(loader as any);
});
</script>

<template>
  <div
    data-testid="svg-image"
    :class="[
      PREFIX,
      {
        [`${PREFIX}_size-${size}`]: !!size,
        [`${PREFIX}_mode-${mode}`]: !!mode,
        [`${PREFIX}_tone-${tone}`]: !!tone,
      },
    ]"
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
$token-prefix: icon;
$prefix: svg-image;

@mixin defineSizes($map: get($components, "atoms.#{$token-prefix}")) {
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

@mixin defineThemes($map: get($themes, "light.mixins.label")) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.#{$prefix}_tone-#{$tone} {
          @include themify($themes) {
            fill: themed("mixins.label.#{$mode}.#{$tone}.normal");
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
