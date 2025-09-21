<!-- is the base for components that float over the rest of the page -->
<script setup lang="ts">
import type { OverlayProps } from "@/components/atoms";

defineProps<OverlayProps>();
</script>

<template>
  <div class="overlay" :class="[{ [`overlay_mode-${mode}`]: !!mode }]"></div>
</template>

<style lang="scss">
@use "sass:map";

@mixin defineThemes($map: get($themes, "light.atoms.overlay")) {
  @each $mode, $modes in $map {
    &_mode-#{$mode} {
      @include themify($themes) {
        background-color: themed("atoms.overlay.#{$mode}.background");
      }
    }
  }
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: none;

  @include defineThemes(map.keys(get($themes, "light.atoms.overlay")));
}
</style>
