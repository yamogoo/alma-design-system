<script setup lang="ts">
import { useTemplateRef } from "vue";
import {
  UIFACETS,
  UIMODIFIERS,
  UIMODIFIERS_ALIGNMENT_MAP,
} from "@/constants/ui";

import { useFacetsClasses } from "@/composables/local/components/useFacetsClasses";

import { useEdgeSpacingClasses } from "@/composables/local";

import { STACK_PREFIX, type StackProps } from "./Stack";

const props = withDefaults(defineProps<StackProps>(), {
  as: "div",
  variant: "default",
  size: "lg",
  direction: "forward",
});

const root = useTemplateRef<HTMLElement | null>("root");

const { paddingClasses, marginClasses } = useEdgeSpacingClasses(
  { padding: props.padding, margin: props.margin },
  {
    prefix: STACK_PREFIX,
    modifiers: {
      padding: UIMODIFIERS.PADDING,
      margin: UIMODIFIERS.MARGIN,
    },
  }
);

const { classes: facetClasses } = useFacetsClasses({
  prefix: STACK_PREFIX,
  props: props,
  facets: [UIFACETS.VARIANT, UIFACETS.SIZE],
  modifiers: [
    UIMODIFIERS.DIRECTION,
    UIMODIFIERS.ORIENTATION,
    UIMODIFIERS.HORIZONTAL_ALIGNMENT,
    UIMODIFIERS.VERTICAL_ALIGNMENT,
    UIMODIFIERS.STRETCH,
    UIMODIFIERS.WRAP,
    UIMODIFIERS.ROUNDED,
    UIMODIFIERS.DIVIDER,
    UIMODIFIERS.BORDERED,
  ],
  map: { ...UIMODIFIERS_ALIGNMENT_MAP },
});

defineExpose({
  root,
});
</script>

<template>
  <component
    :is="as"
    ref="root"
    :class="[facetClasses, paddingClasses, marginClasses]"
    :role="role"
    :aria-label="ariaLabel"
  >
    <slot></slot>
  </component>
</template>

<style lang="scss">
$tokenName: "stack";
$prefix: getPrefix("stack");

@mixin defineSizes($map: get($components, "atoms.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          $gap: px2rem(get($val, "root.gap"));

          // $respond-padding-block: px2rem(
          //   get($val, "root.padding-block.respond")
          // );
          // $respond-padding-inline: px2rem(
          //   get($val, "root.padding-inline.respond")
          // );

          --#{$prefix}-gap: #{px2rem(get($val, "root.gap"))};
          --#{$prefix}-border-radius: #{px2rem(
              get($val, "root.border-radius")
            )};
          --#{$prefix}-border-width: #{px2rem(get($val, "root.border-width"))};
          --#{$prefix}-padding-block: #{px2rem(
              get($val, "root.padding-block")
            )};
          --#{$prefix}-padding-inline: #{px2rem(
              get($val, "root.padding-inline")
            )};
          --#{$prefix}-margin-block: #{px2rem(get($val, "root.margin-block"))};
          --#{$prefix}-margin-inline: #{px2rem(
              get($val, "root.margin-inline")
            )};
        }
      }
    }
  }
}

.#{$prefix} {
  gap: var(--#{$prefix}-gap, 1rem);

  @include defineSizes();

  &_rounded {
    border-radius: var(--#{$prefix}-border-radius, 0rem);
  }

  &_divider {
    &.#{$prefix}_orientation-horizontal {
      padding-right: var(--#{$prefix}-gap, 0);
      border-right-style: solid;
    }

    &.#{$prefix}_orientation-vertical {
      padding-bottom: var(--#{$prefix}-gap, 0);
      border-bottom-style: solid;
    }
  }

  &_padding {
    @include usePadding(
      var(--#{$prefix}-padding-inline, 0),
      var(--#{$prefix}-padding-block, 0)
    );
  }

  &_margin {
    @include useMargin(
      var(--#{$prefix}-margin-inline, 0),
      var(--#{$prefix}-margin-block, 0)
    );
  }

  &_bordered {
    border-style: solid;
    border-width: var(--#{$prefix}-border-width, 0);
  }

  &_orientation {
    @include useOrientation();
  }

  &_direction {
    @include useDirection();
  }

  &_align {
    @include useAlign($prefix);
  }

  &_stretch {
    &-fill {
      @include box(100%);
    }

    &-auto {
      @include box(max-content);
    }
  }

  &_wrap {
    flex-wrap: wrap;
  }
}
</style>
