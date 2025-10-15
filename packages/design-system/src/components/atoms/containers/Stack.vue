<script setup lang="ts">
import { UIFACETS, UIMODIFIERS } from "@/constants/ui";

import { useFacetsClasses } from "@/composables/local/components/useFacetsClasses";

import { useEdgeSpacingClasses } from "@/composables/local";

import { STACK_PREFIX, type StackProps } from "./Stack";

const props = withDefaults(defineProps<StackProps>(), {
  as: "div",
});

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
    `${UIMODIFIERS.ALIGN}-vertical`,
    `${UIMODIFIERS.ALIGN}-horizontal`,
    UIMODIFIERS.STRETCH,
    UIMODIFIERS.WRAP,
    UIMODIFIERS.DIVIDER,
    UIMODIFIERS.BORDERED,
  ],
});
</script>

<template>
  <component
    :is="as"
    :class="[facetClasses, paddingClasses, marginClasses]"
    :role="role"
    :aria-label="ariaLabel"
  >
    <slot></slot>
  </component>
</template>

<style lang="scss">
$tokenName: "stack";
$prefix: getPrefix($tokenName);

// @include core.generate_container_modifiers(
//   $selector: $prefix,
//   $defs: core.$containers
// );

@mixin defineSizes($map: get($components, "atoms.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          $gap: px2rem(get($val, "root.gap"));
          $padding-block: px2rem(get($val, "root.padding-block"));
          $padding-inline: px2rem(get($val, "root.padding-inline"));

          --#{$prefix}-gap: #{px2rem(get($val, "root.gap"))};
          --#{$prefix}-padding-block: #{px2rem(
              get($val, "root.padding-block")
            )};
          --#{$prefix}-padding-inline: #{px2rem(
              get($val, "root.padding-inline")
            )};
        }
      }
    }
  }
}

.#{$prefix} {
  display: flex;
  flex-direction: column;
  gap: var(--#{$prefix}-gap, 1rem);
  @include defineSizes();

  &_divider {
    &.#{$prefix}_orientation-horizontal {
      padding-right: var(--#{$prefix}-gap, 0);
      border-right-style: solid;
    }
  }
  &_divider {
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
      var(--#{$prefix}-padding-inline, 0),
      var(--#{$prefix}-padding-block, 0)
    );
  }

  &_orientation {
    @include useOrientation();
  }

  &_direction {
    @include useDirection();
  }

  &_align {
    @include useAlign();
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
