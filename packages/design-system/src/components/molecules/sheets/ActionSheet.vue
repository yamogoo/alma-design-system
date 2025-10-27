<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import gsap from "gsap";

import { useFacetsClasses } from "@/composables/local/components/useFacetsClasses";

import { UIFACETS, OVERLAY_IDS } from "@/constants/ui";

import { ACTION_SHEET_PREFIX, type ActionSheetProps } from "./ActionSheet";
import ActionSheetHeader from "./ActionSheetHeader.vue";
import ScrollView from "@/components/atoms/containers/ScrollView.vue";
import Surface from "@/components/atoms/containers/Surface.vue";
import Overlay from "@/components/molecules/containers/Overlay.vue";

const MODAL_ANIM_DURATION_IN = 0.25,
  MODAL_ANIM_DURATION_OUT = 0.25;

const props = withDefaults(defineProps<ActionSheetProps>(), {
  containerId: OVERLAY_IDS.MAIN,
  variant: "default",
  size: "md",
  mode: "neutral",
  tone: "primary",
  rounded: true,
  alignHorizontal: "center",
  alignVertical: "center",
  stretch: "auto",
});

const emit = defineEmits<{
  (e: "update:is-open", isOpen: boolean): void;
  (e: "close"): void;
}>();

const localIsOpen = ref(props.isOpen);
const isModalMounted = ref(false);
const isRendered = ref(false);

const { classes: facetClasses } = useFacetsClasses({
  prefix: ACTION_SHEET_PREFIX,
  props: props,
  facets: [UIFACETS.VARIANT, UIFACETS.SIZE],
});

const onClose = (): void => {
  isRendered.value = false;
  emit("close");
};

const onRequestClose = (): void => {
  if (!localIsOpen.value) return;
  localIsOpen.value = false;
};

watch(
  () => props.isOpen,
  async (newValue) => {
    localIsOpen.value = newValue;

    await nextTick();
    isModalMounted.value = newValue;
  },
  { immediate: true }
);

/* * * Animations * * */

watch(localIsOpen, async (isOpen) => {
  if (isOpen) isRendered.value = true;
  emit("update:is-open", isOpen);

  await nextTick();
  isModalMounted.value = isOpen;
});

const getOffsetY = (el: Element): number => {
  return el.clientHeight / 4;
};

const onAnimEnter = (el: Element, done: () => void): void => {
  const y = getOffsetY(el);

  gsap.fromTo(
    el,
    {
      y: y,
      opacity: 0,
    },
    {
      y: "0%",
      opacity: 1,
      duration: MODAL_ANIM_DURATION_IN,
      ease: "power4.out",
      onComplete: done,
    }
  );
};

const onAnimLeave = (el: Element, done: () => void): void => {
  const y = getOffsetY(el);

  gsap.to(el, {
    y,
    opacity: 0,
    duration: MODAL_ANIM_DURATION_OUT,
    ease: "power4.out",
    onComplete: () => {
      onClose();
      done();
    },
  });
};
</script>

<template>
  <Overlay
    :container-id="containerId"
    :is-open="isRendered"
    @close="onRequestClose"
  >
    <Transition :css="false" @enter="onAnimEnter" @leave="onAnimLeave">
      <Surface
        v-if="isModalMounted"
        :class="[facetClasses]"
        :mode="mode"
        :tone="tone"
        :direction="direction"
        :orientation="orientation"
        :align-vertical="alignVertical"
        :align-horizontal="alignHorizontal"
        :stretch="stretch"
        :wrap="wrap"
        :border="border"
        :bordered="bordered"
        :rounded="rounded"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <slot name="sidebar"></slot>
        <div :class="[`${ACTION_SHEET_PREFIX}__content`]">
          <slot name="header">
            <ActionSheetHeader
              :title="title"
              :is-active="true"
              @close="onRequestClose"
            ></ActionSheetHeader>
          </slot>
          <ScrollView :class="[`${ACTION_SHEET_PREFIX}__body`]">
            <slot> </slot>
          </ScrollView>
        </div>
      </Surface>
    </Transition>
  </Overlay>
</template>

<style lang="scss">
@use "sass:map";

$tokenName: "action-sheet";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "molecules.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          @include apply-token($val, width, "root.width");
          @include apply-token($val, height, "root.height");
          @include apply-token($val, border-radius, "root.border-radius");
        }
      }
    }
  }
}

.#{$prefix} {
  box-sizing: border-box;
  overflow: auto;

  @include defineSizes();

  &__content {
    display: flex;
    flex-direction: column;
    @include box(100%);
    overflow: hidden;
  }
}
</style>
