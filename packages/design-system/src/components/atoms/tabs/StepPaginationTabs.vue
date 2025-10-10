<script setup lang="ts">
import { watch, computed, useTemplateRef, ref, onMounted } from "vue";
import gsap from "gsap";

import { UIFACETS, UISTATES } from "@/constants/ui";

import tokens from "@/tokens";

import { type TextVariant } from "@/adapters/atoms/text";

import Text from "@/components/atoms/typography/Text.vue";

import {
  STEP_PAGINATIO_TABS_PREFIX,
  type StepPaginationTabItem,
  type StepPaginationTabsProps,
} from "./StepPaginationTabs";

const props = withDefaults(defineProps<StepPaginationTabsProps>(), {
  variant: "default",
  mode: "neutral",
  tone: "primary",
  size: "md",
  selectedItemIndex: 0,
});

const emit = defineEmits<{
  (e: "update:selected-item-index", selectedItemIndex: number): void;
}>();

const refsItems = ref<Array<HTMLElement>>([]);
const refTrack = useTemplateRef("track");

const itemWidth = ref(100 / 3);

const itemStyle = computed(() => ({
  width: `${itemWidth.value}%`,
}));

const textVariant = computed(() => {
  return tokens.components.atoms.stepPaginationTabs.default[props.size].item
    .fontStyle.$value as TextVariant;
});

const onItemClick = (item: StepPaginationTabItem): void => {
  if (item.id !== props.selectedItemIndex) {
    emit("update:selected-item-index", item.id);
  }
};

const getItemState = (idx: number) => {
  if (idx === props.selectedItemIndex) return UISTATES.CURRENT;
  if (idx === props.selectedItemIndex + 1 && idx < props.items.length)
    return UISTATES.NEXT;
  if (idx === props.selectedItemIndex - 1 && idx >= 0) return UISTATES.PREVIOUS;
  return UISTATES.NORMAL;
};

/* * * Animations * * */

const onAnimTrackAndItem = (id: number, duration = 0.55) => {
  const tl = gsap.timeline({ defaults: { duration, ease: "power4.out" } });

  if (refTrack.value) {
    tl.to(
      refTrack.value,
      { x: `${-itemWidth.value * id + itemWidth.value}%` },
      0
    );
  }

  refsItems.value.forEach((el, idx) => {
    if (!el) return;
    tl.to(el, { scale: idx === id ? 1 : 0.88 }, 0);
  });
};

watch(
  () => props.selectedItemIndex,
  (id) => {
    onAnimTrackAndItem(id);
  }
);

onMounted(() => {
  onAnimTrackAndItem(props.selectedItemIndex, 0);
});
</script>

<template>
  <div
    :class="[
      STEP_PAGINATIO_TABS_PREFIX,
      `${STEP_PAGINATIO_TABS_PREFIX}_${UIFACETS.VARIANT}-${variant}`,
      `${STEP_PAGINATIO_TABS_PREFIX}_${UIFACETS.SIZE}-${size}`,
      `${STEP_PAGINATIO_TABS_PREFIX}_${UIFACETS.MODE}-${mode}`,
      `${STEP_PAGINATIO_TABS_PREFIX}_${UIFACETS.TONE}-${tone}`,
    ]"
  >
    <div ref="track" :class="`${STEP_PAGINATIO_TABS_PREFIX}__track`">
      <div
        v-for="(item, idx) in items"
        :key="item.id"
        ref="refsItems"
        :class="[
          `${STEP_PAGINATIO_TABS_PREFIX}__item`,
          `${STEP_PAGINATIO_TABS_PREFIX}__item_${UIFACETS.STATE}-${getItemState(idx)}`,
        ]"
        :style="itemStyle"
      >
        <Text
          :class="[`${STEP_PAGINATIO_TABS_PREFIX}__item-lable`]"
          :variant="textVariant"
          role="tab"
          :aria-selected="getItemState(idx) === 'current'"
          @click="onItemClick(item)"
        >
          {{ item.label }}
        </Text>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$tokenName: "step-pagination-tabs";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "atoms.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          $font-style: get($val, "item.font-style");

          .#{$prefix}__item {
            @extend %t__#{$font-style};
          }
        }
      }
    }
  }
}

@mixin defineThemes(
  $map: get($themes, "light.components.atoms.#{$tokenName}")
) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.#{$prefix}_tone-#{$tone} {
          .#{$prefix}__item {
            &_state {
              &-current {
                @include themify($themes) {
                  color: themed(
                    "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.item.label.active"
                  );
                }
              }

              &-next,
              &-previous {
                @include themify($themes) {
                  color: themed(
                    "components.atoms.#{$tokenName}.#{$mode}.#{$tone}.item.label.normal"
                  );
                }
              }
            }
          }
        }
      }
    }
  }
}

.#{$prefix} {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  @include defineSizes();
  @include defineThemes();

  &__track {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
  }

  &__item {
    display: flex;
    justify-content: center;
    transform-origin: center;
    transition: opacity 0.3s;
    cursor: pointer;

    &_state {
      &-previous {
        justify-content: flex-start;
      }

      &-current {
        justify-content: center;
      }

      &-next {
        justify-content: flex-end;
      }
    }
  }
}
</style>
