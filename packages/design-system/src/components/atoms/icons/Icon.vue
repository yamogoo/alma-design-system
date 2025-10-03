<script setup lang="ts">
import { defineAsyncComponent, computed, markRaw, useTemplateRef } from "vue";

import {
  Skeleton,
  iconManifest,
  type IconFullName,
  type IconProps,
} from "@/components/atoms";

const PREFIX = "icon";

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
      PREFIX,
      {
        [`${PREFIX}_variant-${variant}`]: !!variant,
        [`${PREFIX}_size-${size}`]: !!size,
        [`${PREFIX}_mode-${mode}`]: !!mode,
        [`${PREFIX}_tone-${tone}`]: !!tone,
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
$prefix: icon;

@mixin defineSizes($map: get($components, "atoms.#{$prefix}")) {
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

@mixin defineThemes($map: get($themes, "light.contracts.interactive.label")) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.#{$prefix}_tone-#{$tone} {
          svg {
            path {
              @include themify($themes) {
                fill: themed(
                  "contracts.interactive.label.#{$mode}.#{$tone}.normal"
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
