<script setup lang="ts" generic="T">
import { useTemplateRef } from "vue";

import { useMenuNavigation } from "@/composables/local";

import {
  SIMPLE_MENU_PREFIX,
  type SimpleMenuProps,
} from "@/components/atoms/menu/SimpleMenu";
import type { IMenuItem } from "@/components/atoms/menu/menu";
import MenuItem from "@/components/atoms/menu/MenuItem.vue";
import Text from "@/components/atoms/typography/Text.vue";

const props = withDefaults(defineProps<SimpleMenuProps<T>>(), {
  variant: "default",
  size: "lg",
  orientation: "horizontal",
});

const emit = defineEmits<{
  (e: "select", item: IMenuItem<T>): void;
  (e: "update:selected-item-index", id: number): void;
}>();

const refRoot = useTemplateRef<HTMLDivElement | null>("root");

useMenuNavigation({
  root: refRoot,
  orientation: props.orientation,
});

const onPress = (item: IMenuItem<T>): void => {
  emit("select", item);

  const { id } = item;
  emit("update:selected-item-index", id);
};

/* * * Keyboard * * */
</script>

<template>
  <div
    ref="root"
    :class="[
      SIMPLE_MENU_PREFIX,
      `${SIMPLE_MENU_PREFIX}_variant-${variant}`,
      `${SIMPLE_MENU_PREFIX}_size-${size}`,
      `${SIMPLE_MENU_PREFIX}_orientation-${orientation}`,
    ]"
    :role="orientation === 'vertical' ? 'menu' : 'menubar'"
  >
    <MenuItem
      v-for="item in items"
      :key="item.id"
      v-memo="[item.id === selectedItemIndex]"
      :is-active="item.id === selectedItemIndex"
      role="menuitem"
      :data-testid="`${SIMPLE_MENU_PREFIX}__item`"
      :tabindex="item.id === selectedItemIndex ? 0 : -1"
      @is-pressed="onPress(item)"
    >
      <Text
        :as="'span'"
        :class="`${SIMPLE_MENU_PREFIX}__item-label`"
        :data-testid="`${SIMPLE_MENU_PREFIX}__item-label`"
      >
        {{ item.label }}
      </Text>
    </MenuItem>
  </div>
</template>

<style lang="scss">
$tokenName: "simple-menu";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "atoms.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.s#{$prefix}_size-#{$size} {
          $gap: px2rem(get($val, "root.gap"));
          $padding: px2rem(get($val, "root.padding"));

          $label-font-style: get($val, "item-label.font-style");

          gap: $gap;
          padding: $padding;

          .#{$prefix}__item {
            &-label {
              @extend %t__#{$label-font-style};
            }
          }
        }
      }
    }
  }
}

.#{$prefix} {
  display: flex;
  @include defineSizes();

  &_orientation {
    &-horizontal {
      flex-direction: row;
    }

    &-vertical {
      flex-direction: column;
    }
  }
}
</style>
