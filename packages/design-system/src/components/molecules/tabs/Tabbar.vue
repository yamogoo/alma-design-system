<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from "vue";
import gsap from "gsap";

import { UIFACETS } from "@/constants/ui";

import { useFacetsClasses } from "@/composables/local/components/useFacetsClasses";

import {
  TABBAR_PREFIX,
  type TabbarProps,
  type TabbarSelectedItemIndex,
} from "./Tabbar";
import type { TabbarItemTag } from "./TabbarItem";
import TabbarItem from "./TabbarItem.vue";

const props = withDefaults(defineProps<TabbarProps>(), {
  variant: "default",
  size: "lg",
  mode: "neutral",
  tone: "primary",
  as: "div",
});

const emit = defineEmits<{
  (
    e: "update:selected-item-indexes",
    selectedItemIndexes: TabbarSelectedItemIndex | null
  ): void;
}>();

const refThumb = useTemplateRef("thumb");

const tabbarItemTag: TabbarItemTag = props.as === "ul" ? "li" : "div";

const currentIndex = ref<number>(0);

const { classes: facetClasses } = useFacetsClasses({
  prefix: TABBAR_PREFIX,
  props: props,
  facets: [UIFACETS.VARIANT, UIFACETS.SIZE, UIFACETS.MODE, UIFACETS.TONE],
});

const onSelect = (id: TabbarSelectedItemIndex | null, idx: number): void => {
  currentIndex.value = idx;
  emit("update:selected-item-indexes", id);
};

/* * * Animations * * */

watch(
  currentIndex,
  async (idx) => {
    await nextTick();
    onThumbAnimate(idx);
  },
  { immediate: true }
);

const onThumbAnimate = (idx: number): void => {
  const el = refThumb.value;

  if (!el) return;

  const offsetX = (100 / props.items.length) * idx;

  gsap.to(el, {
    left: `${offsetX}%`,
    ease: "power4.out",
    duration: 0.35,
  });
};
</script>

<template>
  <component :is="as" :class="[facetClasses]" role="tablist">
    <div :class="[`${TABBAR_PREFIX}__container`]">
      <TabbarItem
        v-for="(item, idx) in items"
        :key="item.id"
        v-bind="item"
        :as="tabbarItemTag"
        :is-active="item.id === selectedItemIndexes"
        @select="onSelect(item.id, idx)"
      >
      </TabbarItem>
      <div
        ref="thumb"
        :class="[`${TABBAR_PREFIX}__thumb`]"
        :style="{
          [`--${TABBAR_PREFIX}-thumb-width`]: `${100 / items.length}%`,
        }"
      ></div>
    </div>
  </component>
</template>

<style lang="scss">
$tokenName: "tabbar";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "molecules.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          $height: get($val, "root.height");
          $padding: px2rem(get($val, "root.padding"));
          $border-radius: px2rem(get($val, "root.border-radius"));

          --#{$prefix}-height: #{$height};
          --#{$prefix}-padding: #{$padding};
          --#{$prefix}-border-radius: #{$border-radius};
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
          .#{$prefix}__thumb {
            @include themify($themes) {
              background-color: themed(
                "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.item.root.background.selected"
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
  height: var(--#{$prefix}-height, auto);
  padding: var(--#{$prefix}-padding, 0);
  border-radius: var(--#{$prefix}-border-radius, 0);

  @include defineSizes();
  @include defineThemes();

  &__container {
    position: relative;
    display: flex;
    justify-content: space-around;
  }

  &__thumb {
    position: absolute;
    left: 0;
    width: var(--#{$prefix}-thumb-width, 100%);
    height: 100%;
    border-radius: var(--#{$prefix}-border-radius, 0);
    z-index: 0;
  }
}
</style>
