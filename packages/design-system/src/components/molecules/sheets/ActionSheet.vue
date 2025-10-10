<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from "vue";
import gsap from "gsap";

import { UIFACETS } from "@/constants/ui";

import { Constants } from "@/constants";

import { ACTION_SHEET_PREFIX, type ActionSheetProps } from "./ActionSheet";
import { Surface } from "@/components/atoms/containers";

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
    <Surface
      v-if="isRendered"
      ref="root"
      :class="[
        ACTION_SHEET_PREFIX,
        `${ACTION_SHEET_PREFIX}_${UIFACETS.VARIANT}-${variant}`,
        `${ACTION_SHEET_PREFIX}_${UIFACETS.SIZE}-${size}`,
      ]"
      :variant="variant"
      :size="size"
      :mode="mode"
      :tone="tone"
    >
      <slot></slot>
    </Surface>
  </Teleport>
</template>

<style lang="scss">
@use "sass:map";

$tokenName: "action-sheet";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "molecules.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $min-height: px2rem(get($val, "root.min-height"));
      $border-radius: px2rem(get($val, "root.border-radius"));

      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          min-height: $min-height;
          border-radius: $border-radius $border-radius 0 0;
        }
      }
    }
  }
}

.#{$prefix} {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  overflow: auto;

  @include defineSizes();
}
</style>
