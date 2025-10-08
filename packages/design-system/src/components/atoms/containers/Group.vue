<script setup lang="ts">
import type { GroupProps } from "./Group";
import Surface from "./Surface.vue";

const PREFIX = "group";

const props = withDefaults(defineProps<GroupProps>(), {
  variant: "default",
  as: "div",
  role: "group",
  size: "md",
  ariaLabel: "group",
  stretch: "auto",
});

const componentTag = props.as;
</script>

<template>
  <Surface
    :as="componentTag"
    :class="[
      PREFIX,
      `${PREFIX}_variant-${variant}`,
      `${PREFIX}_size-${size}`,
      {
        [`${PREFIX}_direction-${direction}`]: !!direction,
        [`${PREFIX}_orientation-${orientation}`]: !!orientation,
        [`${PREFIX}_align-vertical-${verticalAlignment}`]: !!verticalAlignment,
        [`${PREFIX}_align-horizontal-${horizontalAlignment}`]:
          !!horizontalAlignment,
        [`${PREFIX}_stretch-${stretch}`]: !!stretch,
        [`${PREFIX}_wrap`]: wrap,
        [`${PREFIX}_divider`]: divider,
      },
    ]"
    :mode="mode"
    :tone="tone"
    :stretch="stretch"
    :role="role"
    :aria-label="ariaLabel"
    :style="{ gap: gapY ? gapY : undefined }"
    data-testid="group"
  >
    <slot></slot>
  </Surface>
</template>

<style lang="scss">
@use "sass:map";

$prefix: "group";

@mixin defineSizes($map: get($components, "atoms.#{$prefix}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $gap: px2rem(get($val, "root.gap"));
      $padding: px2rem(get($val, "root.padding"));
      $border-radius: px2rem(get($val, "root.border-radius"));
      $divider-border-width: px2rem(get($val, "root.border-width"));

      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          gap: $gap;
          padding: $padding;
          border-radius: $border-radius;

          &.#{$prefix}_divider {
            &.#{$prefix}_orientation-horizontal {
              border-right-width: $divider-border-width;
              padding-right: $gap;
            }

            &.#{$prefix}_orientation-vertical {
              border-bottom-width: $divider-border-width;
              padding-bottom: $gap;
            }
          }
        }
      }
    }
  }
}

.group {
  display: flex;
  @extend %base-transition;

  @include defineSizes();

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

  &_divider {
    &.#{$prefix}orientation-horizontal {
      border-right-style: solid;
    }

    &.#{$prefix}orientation-vertical {
      border-bottom-style: solid;
    }
  }

  @each $variant, $sizes in get($components, "atoms.group") {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$prefix}size-#{$size} {
          gap: px2rem(get($val, "root.gap"));
        }
      }
    }
  }
}
</style>
