<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from "vue";
import gsap from "gsap";

import { Constants } from "@/constants";

import type { ActionSheetProps } from "@/components/atoms";

const props = withDefaults(defineProps<ActionSheetProps>(), {
  variant: "default",
  containerId: Constants.OVERLAY_IDS.MAIN,
  size: "md",
});

const emit = defineEmits<{
  (e: "close"): void;
}>();

const refRoot = useTemplateRef<HTMLDivElement | null>("root");

const isRendered = ref(false);

/* * * Animations * * */

watch(
  () => props.isActive,
  async (active) => {
    if (active) {
      isRendered.value = true;
      await nextTick();

      gsap.fromTo(
        refRoot.value,
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.35, ease: "power4.out" }
      );
    } else {
      if (!refRoot.value) return;

      gsap.to(refRoot.value, {
        y: "100%",
        opacity: 0,
        duration: 0.25,
        ease: "power4.in",
        onComplete: () => {
          isRendered.value = false;
          emit("close");
        },
      });
    }
  }
);
</script>

<template>
  <Teleport :to="containerId">
    <div
      v-if="isRendered"
      ref="root"
      class="action-sheet"
      :class="[
        `action-sheet_variant-${variant}`,
        `action-sheet_size-${size}`,
        { [`action-sheet_mode-${mode}`]: !!mode },
      ]"
    >
      <slot></slot>
    </div>
  </Teleport>
</template>

<style lang="scss">
@use "sass:map";

@mixin defineSizes($map: get($atoms, "action-sheet")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $min-height: px2rem(get($val, "self.min-height"));
      $border-radius: px2rem(get($val, "self.border-radius"));

      &_variant-#{$variant} {
        &.action-sheet_size-#{$size} {
          min-height: $min-height;
          border-radius: $border-radius $border-radius 0 0;
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.atoms.action-sheet")) {
  @each $mode, $modes in $map {
    &_mode-#{$mode} {
      @include themify($themes) {
        background-color: themed(
          "atoms.action-sheet.#{$mode}.background.normal"
        );
        box-shadow: 0 -2px 12px
          themed("atoms.action-sheet.#{$mode}.shadow.normal");
      }
    }
  }
}

.action-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  overflow: auto;

  @include defineSizes();
  @include defineThemes();
}
</style>
