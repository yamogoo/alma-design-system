<script setup lang="ts">
import type { GroupProps } from "@/components/atoms";

const props = withDefaults(defineProps<GroupProps>(), {
  variant: "default",
  as: "div",
  role: "group",
  size: "md",
  mode: "ghost",
  ariaLabel: "group",
});

const componentTag = props.as;
</script>

<template>
  <component
    :is="componentTag"
    class="group"
    :class="[
      `group_variant-${variant}`,
      `group_size-${size}`,
      `group_mode-${mode}`,
      {
        [`group_direction-${direction}`]: !!direction,
        [`group_orientation-${orientation}`]: !!orientation,
        [`group_align-vertical-${verticalAlignment}`]: !!verticalAlignment,
        [`group_align-horizontal-${horizontalAlignment}`]:
          !!horizontalAlignment,
        [`group_stretch-${stretch}`]: !!stretch,
        group_wrap: wrap,
        group_divider: divider,
      },
    ]"
    :role="role"
    :aria-label="ariaLabel"
    :style="{ gap: gapY ? gapY : undefined }"
  >
    <slot></slot>
  </component>
</template>

<style lang="scss">
@use "sass:map";

@mixin defineSizes($map: get($atoms, "group")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $gap: px2rem(get($val, "self.gap"));
      $padding: px2rem(get($val, "self.padding"));
      $border-radius: px2rem(get($val, "self.border-radius"));
      $divider-border-width: px2rem(get($val, "self.border-width"));

      &_variant-#{$variant} {
        &.group_size-#{$size} {
          gap: $gap;
          padding: $padding;
          border-radius: $border-radius;

          &.group_divider {
            &.group_orientation-horizontal {
              border-right-width: $divider-border-width;
              padding-right: $gap;
            }

            &.group_orientation-vertical {
              border-bottom-width: $divider-border-width;
              padding-bottom: $gap;
            }
          }
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.atoms.group")) {
  @each $mode, $modes in $map {
    &_mode-#{$mode} {
      @include themify($themes) {
        background-color: themed("atoms.group.#{$mode}.self.background");
      }

      &.group_divider {
        &.group_orientation-horizontal {
          @include themify($themes) {
            border-right-color: themed("atoms.group.#{$mode}.self.divider");
          }
        }

        &.group_orientation-vertical {
          @include themify($themes) {
            border-bottom-color: themed("atoms.group.#{$mode}.self.divider");
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
  @include defineThemes();

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
      &.group_orientation {
        &-vertical {
          @include box(auto, 100%);
        }

        &-horizontal {
          @include box(100%, auto);
        }
      }
    }
  }

  &_wrap {
    flex-wrap: wrap;
  }

  &_divider {
    &.group_orientation-horizontal {
      border-right-style: solid;
    }

    &.group_orientation-vertical {
      border-bottom-style: solid;
    }
  }

  @each $variant, $sizes in get($atoms, "group") {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.group_size-#{$size} {
          gap: px2rem(get($val, "self.gap"));
        }
      }
    }
  }
}
</style>
