<script setup lang="ts">
import { useFacetsClasses } from "@/composables/local/components/useFacetsClasses";

import { UIFACETS } from "@/constants/ui";

import { SIDEBAR_PREFIX, type SidebarProps } from "./Sidebar";
import Surface from "@/components/atoms/containers/Surface.vue";

const props = withDefaults(defineProps<SidebarProps>(), {
  variant: "default",
  size: "lg",
  mode: "neutral",
  tone: "primary",
});

const { classes: facetClasses } = useFacetsClasses({
  prefix: SIDEBAR_PREFIX,
  props: props,
  facets: [UIFACETS.VARIANT, UIFACETS.SIZE, UIFACETS.MODE, UIFACETS.TONE],
});
</script>

<template>
  <div :class="[facetClasses]">
    <Surface
      :class="`${SIDEBAR_PREFIX}__container`"
      variant="default"
      size="md"
      mode="neutral"
      tone="primary"
    >
      <slot></slot>
    </Surface>
  </div>
</template>

<style lang="scss">
$tokenName: "sidebar";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "molecules.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          $min-width: #{get($val, "root.width")};
          $padding: #{get($val, "root.padding")};

          $container-padding: #{get($val, "container.padding")};
          $container-border-radius: #{get($val, "container.border-radius")};

          --#{$prefix}-width: #{$min-width};
          --#{$prefix}-padding: #{$padding};

          --#{$prefix}-container-padding: #{$container-padding};
          --#{$prefix}-container-border-radius: #{$container-border-radius};
        }
      }
    }
  }
}

.#{$prefix} {
  box-sizing: border-box;
  position: relative;
  width: var(--#{$prefix}-width, 100%);
  height: 100%;
  padding: var(--#{$prefix}-padding, 100%);
  overflow: auto;

  @include defineSizes();

  &__container {
    box-sizing: border-box;
    @include box(100%);
    padding: var(--#{$prefix}-container-padding, 100%);
    border-radius: var(--#{$prefix}-container-border-radius, 100%);
  }
}
</style>
