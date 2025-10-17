<script setup lang="ts">
import { UIFACETS, UIMODIFIERS } from "@/constants/ui";

import { GROUP_PREFIX, type GroupProps } from "./Group";
import Surface from "@/components/atoms/containers/Surface.vue";

const props = withDefaults(defineProps<GroupProps>(), {
  variant: "default",
  as: "div",
  role: "group",
  size: "md",
  ariaLabel: "group",
  stretch: "auto",
  bordered: false,
});

const componentTag = props.as;
</script>

<template>
  <Surface
    :as="componentTag"
    :class="[
      GROUP_PREFIX,
      `${GROUP_PREFIX}_${UIFACETS.VARIANT}-${variant}`,
      `${GROUP_PREFIX}_${UIFACETS.SIZE}-${size}`,
      {
        [`${GROUP_PREFIX}_${UIMODIFIERS.DIRECTION}-${direction}`]: !!direction,
        [`${GROUP_PREFIX}_${UIMODIFIERS.ORIENTATION}-${orientation}`]:
          !!orientation,
        [`${GROUP_PREFIX}_${UIMODIFIERS.ALIGN}-vertical-${alignVertical}`]:
          !!alignVertical,
        [`${GROUP_PREFIX}_${UIMODIFIERS.ALIGN}-horizontal-${alignHorizontal}`]:
          !!alignHorizontal,
        [`${GROUP_PREFIX}_${UIMODIFIERS.STRETCH}-${stretch}`]: !!stretch,
        [`${GROUP_PREFIX}_${UIMODIFIERS.WRAP}`]: wrap,
        [`${GROUP_PREFIX}_${UIMODIFIERS.DIVIDER}`]: divider,
      },
    ]"
    :mode="mode"
    :tone="tone"
    :stretch="stretch"
    :role="role"
    :aria-label="ariaLabel"
    :border="bordered ? 'rtlb' : undefined"
    data-testid="group"
  >
    <slot></slot>
  </Surface>
</template>

<style lang="scss">
@use "sass:map";

$tokenName: "group";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "molecules.#{$tokenName}")) {
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

.#{$prefix} {
  display: flex;

  @include defineSizes();

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

  &_divider {
    &.#{$prefix}_orientation-horizontal {
      border-right-style: solid;
    }

    &.#{$prefix}_orientation-vertical {
      border-bottom-style: solid;
    }
  }
}
</style>
