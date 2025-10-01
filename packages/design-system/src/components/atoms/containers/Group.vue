<script setup lang="ts">
import type { GroupProps } from "./Group";

const PREFIX = "group";

const props = withDefaults(defineProps<GroupProps>(), {
  variant: "default",
  as: "div",
  role: "group",
  size: "md",
  mode: "neutral",
  tone: "ghost",
  ariaLabel: "group",
});

const componentTag = props.as;
</script>

<template>
  <component
    :is="componentTag"
    :class="[
      PREFIX,
      `${PREFIX}_variant-${variant}`,
      `${PREFIX}_size-${size}`,
      {
        [`${PREFIX}_mode-${mode}`]: !!mode,
        [`${PREFIX}_tone-${tone}`]: !!tone,
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
    :role="role"
    :aria-label="ariaLabel"
    :style="{ gap: gapY ? gapY : undefined }"
  >
    <slot></slot>
  </component>
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

@mixin defineThemes($map: get($themes, "light.components.atoms.#{$prefix}")) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.#{$prefix}_tone-#{$tone} {
          @include themify($themes) {
            background-color: themed(
              "components.atoms.#{$prefix}.#{$mode}.#{$tone}.root.background"
            );
          }

          &.#{$prefix}divider {
            &.#{$prefix}orientation-horizontal {
              @include themify($themes) {
                border-right-color: themed(
                  "components.atoms.#{$prefix}.#{$mode}.#{$tone}.root.divider"
                );
              }
            }

            &.#{$prefix}orientation-vertical {
              @include themify($themes) {
                border-bottom-color: themed(
                  "components.atoms.#{$prefix}.#{$mode}.#{$tone}.root.divider"
                );
              }
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
