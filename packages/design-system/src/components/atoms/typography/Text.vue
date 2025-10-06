<script lang="ts" setup>
import { computed, type ComputedRef, type CSSProperties } from "vue";

import type { TextProps } from "@/components/atoms";

const PREFIX = "text";

const props = withDefaults(defineProps<TextProps>(), {
  as: "span",
  state: "normal",
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
    :class="[
      PREFIX,
      {
        [`${PREFIX}_variant-${variant}`]: !!variant,
        [`${PREFIX}_mode-${mode}`]: !!mode,
        [`${PREFIX}_tone-${tone}`]: !!tone,
        [`${PREFIX}_state-${state}`]: !!state,
      },
    ]"
    :style="computedStyle"
  >
    {{ value }}
    <slot></slot>
  </component>
</template>

<style lang="scss">
$token-prefix: "label";
$prefix: text;

@mixin defineVariants($map: get($typography, "styles")) {
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

@mixin defineThemes(
  $map: get($themes, "light.contracts.interactive.#{$token-prefix}")
) {
  @each $mode, $modes in $map {
    @each $tone, $states in $modes {
      &_mode-#{$mode} {
        &.#{$prefix}_tone-#{$tone} {
          @include themify($themes) {
            color: themed(
              "contracts.interactive.#{$token-prefix}.#{$mode}.#{$tone}.normal"
            );
          }
        }
      }
    }
  }
}

.#{$prefix} {
  white-space: pre-line;
  b {
    font-style: inherit;
    font-weight: inherit;
  }
  @extend %base-transition;

  @include defineVariants();
  @include defineThemes();
}
</style>
