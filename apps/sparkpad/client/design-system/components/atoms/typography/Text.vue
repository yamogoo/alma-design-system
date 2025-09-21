<script lang="ts" setup>
import { computed, type ComputedRef, type CSSProperties } from "vue";

import type { TextProps } from "@/components/atoms";

const props = withDefaults(defineProps<TextProps>(), {
  as: "span",
  mode: "neutral",
  tone: "primary",
});

const componentTag = props.as;

const computedStyle: ComputedRef<CSSProperties> = computed(() => {
  return {
    display: props.display,
    color: props.color,
    textAlign: props.align,
    letterSpacing: props.letterSpacing,
    textTransform: props.textTransform,
    textDecoration: props.textDecoration,
    fontFamily: props.fontFamily,
    fontStyle: props.fontStyle,
    fontStretch: props.fontStretch,
    fontVariant: props.fontVariant,
    fontFeatureSettings: props.fontFeatureSettings,
    fontSynthesis: props.fontSynthesis,
    textIndent: props.textIndent,
    textOverflow: props.textOverflow,
    overflow: props.textOverflow ? "hidden" : undefined,
    whiteSpace: props.textOverflow ? "nowrap" : undefined,
  } as Record<string, string | undefined>;
});
</script>

<template>
  <component
    :is="componentTag"
    class="text"
    :class="[
      {
        [`text_variant-${variant}`]: !!variant,
        [`text_mode-${mode}`]: !!mode,
        [`text_tone-${tone}`]: !!tone,
      },
    ]"
    :style="computedStyle"
  >
    {{ value }}
    <slot></slot>
  </component>
</template>

<style lang="scss">
@use "sass:map";

@mixin defineVariants($map: map.get($typography, "styles")) {
  @each $variant, $val in $map {
    &_variant-#{$variant} {
      @each $key, $value in $val {
        $result: $value;

        @if $key == "font-size" {
          #{$key}: px2em($result);
        } @else {
          #{$key}: $result;
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.abstracts.label")) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.text_tone-#{$tone} {
          @include themify($themes) {
            color: themed("abstracts.label.#{$mode}.#{$tone}");
          }
        }
      }
    }
  }
}

.text {
  b {
    font-style: inherit;
    font-weight: inherit;
  }
  @extend %base-transition;

  @include defineVariants();
  @include defineThemes();

  b {
    &.accent {
      @include themify($themes) {
        color: themed("abstracts.label.accent.primary");
      }
    }
  }
}
</style>
