<script setup lang="ts">
import { defineAsyncComponent, computed, markRaw } from "vue";

import {
  Skeleton,
  iconManifest,
  type IconFullName,
  type IconProps,
} from "@/components/atoms";

const props = withDefaults(defineProps<IconProps>(), {
  variant: "default",
});

const symbol = computed(() => {
  const { name, appearance, weight } = props;

  const key = `${name}_${appearance}_${weight}`;

  const loader = iconManifest[key as IconFullName];
  return loader ? markRaw(defineAsyncComponent(loader)) : null;
});
</script>

<template>
  <div
    class="icon"
    :class="[
      {
        [`icon_variant-${variant}`]: !!variant,
        [`icon_size-${size}`]: !!size,
        [`icon_mode-${mode}`]: !!mode,
        [`icon_tone-${tone}`]: !!tone,
      },
    ]"
    data-testid="icon"
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
        &.icon_tone-#{$tone} {
          @include themify($themes) {
            fill: themed("abstracts.label.#{$mode}.#{$tone}");
          }
        }
      }
    }
  }
}

.icon {
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
