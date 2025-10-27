<script setup lang="ts">
import gsap from "gsap";

import {
  SECTION_HEADER_PREFIX,
  type SectionHeaderProps,
} from "./SectionHeader";

import { UIFACETS } from "@/constants/ui";

import { useFacetsClasses } from "@/composables/local/components/useFacetsClasses";

import ControlButton from "@/components/molecules/buttons/aliases/ControlButton.vue";
import Text from "@/components/atoms/typography/Text.vue";

const props = withDefaults(defineProps<SectionHeaderProps>(), {
  variant: "default",
  size: "md",
  mode: "neutral",
  tone: "primary",
  isCloseButtonShown: true,
  isActive: false,
});

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { classes: facetClasses } = useFacetsClasses({
  prefix: SECTION_HEADER_PREFIX,
  props: props,
  facets: [UIFACETS.VARIANT, UIFACETS.SIZE, UIFACETS.MODE, UIFACETS.TONE],
});

const onClose = (): void => {
  emit("close");
};

/* * * Animations * * */

const onEnter = (el: Element, done: () => void): void => {
  gsap.fromTo(
    el,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 0.25,
      ease: "power4.out",
      onComplete: done,
    }
  );
};

const onLeave = (el: Element, done: () => void): void => {
  gsap.to(el, {
    opacity: 0,
    duration: 0.25,
    ease: "power4.out",
    onComplete: done,
  });
};
</script>

<template>
  <component
    :is="as"
    :class="[
      facetClasses,
      `${SECTION_HEADER_PREFIX}_${UIFACETS.STATE}-${isActive ? 'active' : 'normal'}`,
    ]"
  >
    <Transition :css="false" @enter="onEnter" @leave="onLeave">
      <div v-if="title" :class="[`${SECTION_HEADER_PREFIX}__title`]">
        <Text :class="[`${SECTION_HEADER_PREFIX}__title-text`]">{{
          title
        }}</Text>
      </div>
    </Transition>
    <div v-if="$slots.controls" :class="[`${SECTION_HEADER_PREFIX}__controls`]">
      <slot name="controls"> </slot>
    </div>
    <ControlButton
      v-if="isCloseButtonShown"
      size="sm"
      mode="neutral"
      tone="primary"
      icon-name="cross"
      icon-style="outline"
      icon-weight="400"
      @click="onClose"
    ></ControlButton>
  </component>
</template>

<style lang="scss">
$tokenName: "section-header";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "molecules.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          $gap: #{get($val, "root.gap")};
          $height: #{px2rem(get($val, "root.height"))};
          $padding: #{px2rem(get($val, "root.padding"))};

          $title-font-style: #{get($val, "title.font-style")};

          --#{$prefix}-gap: #{$gap};
          --#{$prefix}-height: #{$height};
          --#{$prefix}-padding: #{$padding};

          .#{$prefix}__title {
            @extend %t__#{$title-font-style};
          }
        }
      }
    }
  }
}

@mixin defineThemes(
  $map: get($themes, "light.components.molecules.#{$tokenName}")
) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.#{$prefix}_tone-#{$tone} {
          .#{$prefix}__title {
            @include themify($themes) {
              color: themed(
                "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.title.color"
              );
            }
          }
        }
      }
    }
  }
}

.#{$prefix} {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  gap: var(--#{$prefix}-gap, 0);
  width: 100%;
  height: var(--#{$prefix}-height, 0);
  padding: var(--#{$prefix}-padding, 0);

  @include defineSizes();
  @include defineThemes();

  &__title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    &-text {
      color: inherit;
    }
  }
}
</style>
