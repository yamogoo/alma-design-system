<script setup lang="ts">
import { watch, computed, useTemplateRef, ref, onMounted } from "vue";
import g from "gsap";

import tokens from "@/tokens";

import { Text } from "@/components/atoms";
import { type TextVariant } from "@/adapters";

import type {
  StepPaginationTabItem,
  StepPaginationTabsProps,
} from "./StepPaginationTabs";

const props = withDefaults(defineProps<StepPaginationTabsProps>(), {
  variant: "default",
  selectedItemId: 0,
  mode: "primary",
  size: "md",
});

const emit = defineEmits<{
  (e: "update:selected-item-id", selectedItemId: number): void;
}>();

const refsItems = ref<Array<HTMLElement>>([]);
const refTrack = useTemplateRef("track");

const itemWidth = ref(100 / 3);

const itemStyle = computed(() => ({
  width: `${itemWidth.value}%`,
}));

const textVariant = computed(() => {
  return tokens.atoms.stepPaginationTabs.default[props.size].item.fontStyle
    .value as TextVariant;
});

const onItemClick = (item: StepPaginationTabItem): void => {
  if (item.id !== props.selectedItemId) {
    emit("update:selected-item-id", item.id);
  }
};

const getItemState = (idx: number) => {
  if (idx === props.selectedItemId) return "current";
  if (idx === props.selectedItemId + 1 && idx < props.items.length)
    return "next";
  if (idx === props.selectedItemId - 1 && idx >= 0) return "previous";
  return "normal";
};

/* * * Animations * * */

const onAnimTrackAndItem = (id: number, duration = 0.55) => {
  const tl = g.timeline({ defaults: { duration, ease: "power4.out" } });

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
  () => props.selectedItemId,
  (id) => {
    onAnimTrackAndItem(id);
  }
);

onMounted(() => {
  onAnimTrackAndItem(props.selectedItemId, 0);
});
</script>

<template>
  <div
    class="step-pagination-tabs"
    :class="[
      `step-pagination-tabs_variant-${variant}`,
      {
        [`step-pagination-tabs_size-${String(size)}`]: !!size,
        [`step-pagination-tabs_mode-${String(mode)}`]: !!mode,
      },
    ]"
  >
    <div ref="track" class="step-pagination-tabs__track">
      <div
        v-for="(item, idx) in items"
        :key="item.id"
        ref="refsItems"
        class="step-pagination-tabs__item"
        :class="`step-pagination-tabs__item_state-${getItemState(idx)}`"
        :style="itemStyle"
      >
        <Text
          :class="['step-pagination-tabs__item-lable']"
          :variant="textVariant"
          @click="onItemClick(item)"
        >
          {{ item.label }}
        </Text>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use "sass:map";

@mixin defineSizes($map: get($atoms, "step-pagination-tabs")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.step-pagination_size-#{$size} {
          $font-style: get($val, "item.font-style");

          .step-pagination__item {
            @extend %t__#{$font-style};
          }
        }
      }
    }
  }
}

@mixin defineThemes($map: get($themes, "light.atoms.step-pagination-tabs")) {
  @each $mode, $modes in $map {
    &_mode-#{$mode} {
      .step-pagination__item {
        @include themify($themes) {
          color: themed(
            "atoms.step-pagination-tabs.#{$mode}.item.label.normal"
          );
        }

        &_state-active {
          @include themify($themes) {
            color: themed(
              "atoms.step-pagination-tabs.#{$mode}.item.label.active"
            );
          }
        }
      }
    }
  }
}

.step-pagination-tabs {
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
        opacity: 1;
      }

      &-next {
        justify-content: flex-end;
      }

      &-next,
      &-previous {
        opacity: 0.5;
      }
    }
  }
}
</style>
