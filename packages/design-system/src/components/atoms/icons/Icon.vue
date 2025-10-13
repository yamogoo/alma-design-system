<script setup lang="ts">
import { defineAsyncComponent, computed, markRaw, useTemplateRef } from "vue";

import { UIFACETS } from "@/constants/ui";

import {
  ICON_PREFIX,
  iconManifest,
  type IconFullName,
  type IconProps,
} from "./Icon";

import Skeleton from "@/components/atoms/skeletons/Skeleton.vue";

const props = withDefaults(defineProps<IconProps>(), {
  variant: "default",
});

const root = useTemplateRef<HTMLDivElement | null>("root");

const symbol = computed(() => {
  const { name, appearance, weight } = props;

  const key = `${name}_${appearance}_${weight}`;

  const loader = iconManifest[key as IconFullName];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return loader ? markRaw(defineAsyncComponent(loader)) : null;
});

defineExpose({
  root,
});
</script>

<template>
  <div
    ref="root"
    :class="[
      ICON_PREFIX,
      {
        [`${ICON_PREFIX}_${UIFACETS.VARIANT}-${variant}`]: !!variant,
        [`${ICON_PREFIX}_${UIFACETS.SIZE}-${size}`]: !!size,
        [`${ICON_PREFIX}_${UIFACETS.MODE}-${mode}`]: !!mode,
        [`${ICON_PREFIX}_${UIFACETS.TONE}-${tone}`]: !!tone,
      },
    ]"
    data-testid="icon"
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
$prefix: getPrefix("icon");

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
  @include useThemeTransition();

  @include defineSizes();
  @include defineThemes();

  svg {
    @include box(auto, inherit);
    fill: inherit;
    @include useThemeTransition();

    path {
      fill: inherit;
      @include useThemeTransition();
    }
  }

  .skeleton {
    @include box(100%);
  }
}
</style>
