<script setup lang="ts">
import { watch, computed, useTemplateRef, ref, onMounted } from "vue";
import g from "gsap";

import tokens from "@alma/tokens";

import { Text } from "@/components/atoms";
import { type TextVariant } from "@/adapters";

import type {
  StepPaginationTabItem,
  StepPaginationTabsProps,
} from "./StepPaginationTabs";

const PREFIX = "step-pagination-tabs";

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
    .$value as TextVariant;
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
    :class="[
      PREFIX,
      `${PREFIX}_variant-${variant}`,
      {
        [`${PREFIX}_size-${String(size)}`]: !!size,
        [`${PREFIX}_mode-${String(mode)}`]: !!mode,
      },
    ]"
  >
    <div ref="track" :class="`${PREFIX}__track`">
      <div
        v-for="(item, idx) in items"
        :key="item.id"
        ref="refsItems"
        :class="[
          `${PREFIX}__item`,
          `${PREFIX}__item_state-${getItemState(idx)}`,
        ]"
        :style="itemStyle"
      >
        <Text
          :class="[`${PREFIX}__item-lable`]"
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
$prefix: step-pagination-tabs;

@mixin defineSizes($map: get($atoms, "#{$prefix}")) {
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

@mixin defineThemes($map: get($themes, "light.atoms.#{$prefix}")) {
  @each $mode, $modes in $map {
    &_mode-#{$mode} {
      .#{$prefix}__item {
        @include themify($themes) {
          color: themed("atoms.#{$prefix}.#{$mode}.item.label.normal");
        }

        &_state-active {
          @include themify($themes) {
            color: themed("atoms.#{$prefix}.#{$mode}.item.label.active");
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
