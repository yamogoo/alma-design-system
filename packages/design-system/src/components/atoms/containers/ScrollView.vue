<script setup lang="ts">
import { computed, useTemplateRef } from "vue";

import { UIMODIFIERS } from "@/constants/ui";

import { SCROLL_VIEW_PREFIX, type ScrollViewProps } from "./ScrollView";

const props = withDefaults(defineProps<ScrollViewProps>(), {
  as: "div",
  direction: "vertical",
  hideScrollbar: false,
});

const root = useTemplateRef<HTMLElement | null>("root");

const classes = computed(() => [
  SCROLL_VIEW_PREFIX,
  `${SCROLL_VIEW_PREFIX}_${UIMODIFIERS.ORIENTATION}-${props.direction}`,
  {
    [`${SCROLL_VIEW_PREFIX}--hidden-scrollbar`]: props.hideScrollbar,
  },
]);

defineExpose({
  root,
});
</script>

<template>
  <component :is="as" ref="root" :class="classes">
    <slot></slot>
  </component>
</template>

<style lang="scss">
$tokenName: "scroll-view";
$prefix: getPrefix($tokenName);

$scroll-thumb-width: px2rem(
  get($components, "atoms.scrollbar.default.thumb.width")
);
$scroll-thumb-radius: px2rem(
  get($components, "atoms.scrollbar.default.thumb.border-radius")
);

.#{$prefix} {
  position: relative;
  @include maxBox(100%);
  scrollbar-width: thin;
  @include useThemeTransition();

  @include themify($themes) {
    scrollbar-color: themed(
      "contracts.interactive.on-surface.neutral.primary.hovered"
    );
  }

  &::-webkit-scrollbar {
    @include box($scroll-thumb-width);
  }

  &::-webkit-scrollbar-thumb {
    border-radius: $scroll-thumb-radius;
    @include themify($themes) {
      background-color: themed(
        "contracts.interactive.on-surface.neutral.primary.hovered"
      );
    }
  }

  &--hidden-scrollbar {
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &_orientation-vertical {
    overflow-y: auto;
    overflow-x: hidden;
  }

  &_orientation-horizontal {
    overflow-x: auto;
    overflow-y: hidden;
  }

  &_orientation-both {
    overflow: auto;
  }
}
</style>
