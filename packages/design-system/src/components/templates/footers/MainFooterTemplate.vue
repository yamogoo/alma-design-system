<script setup lang="ts">
import type { MainFooterProps } from "@/components/templates";

const PREFIX = "main-footer";

withDefaults(defineProps<MainFooterProps>(), {
  as: "footer",
});
</script>

<template>
  <component
    :is="as"
    :class="[
      PREFIX,
      `${PREFIX}_variant-${variant}`,
      `${PREFIX}_size-${size}`,
      `${PREFIX}_mode-${mode}`,
      `${PREFIX}_tone-${tone}`,
    ]"
  >
    <div v-if="$slots.left" :class="`${PREFIX}__section-left`">
      <slot name="left"></slot>
    </div>
    <div v-if="$slots.default" :class="`${PREFIX}__section-content`">
      <slot></slot>
    </div>
    <div v-if="$slots.right" :class="`${PREFIX}__section-right`">
      <slot name="right"></slot>
    </div>
  </component>
</template>

<style lang="scss">
$prefix: main-footer;

@mixin defineSizes($map: get($templates, $prefix)) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          $padding-v: px2rem(get($val, "root.padding"));
          padding-top: $padding-v;
          padding-bottom: $padding-v;
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.templates.#{$prefix}")) {
  @each $tone, $modes in $map {
    @each $mode, $val in $modes {
      &_tone-#{$tone} {
        &.#{$prefix}_mode-#{$mode} {
          @include themify($themes) {
            background-color: themed(
              "templates.#{$prefix}.#{$tone}.#{$mode}.root.background.normal"
            );
            border: $outline solid
              themed(
                "templates.#{$prefix}.#{$tone}.#{$mode}.root.border.normal"
              );
          }
          @extend %base-transition;
        }
      }
    }
  }
}

.#{$prefix} {
  $padding-v: px2rem(get($spacing, "sm"));

  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  @extend %main-container;
  padding-top: $padding-v;
  padding-bottom: $padding-v;

  @include defineSizes();
  @include defineThemes();
}
</style>
