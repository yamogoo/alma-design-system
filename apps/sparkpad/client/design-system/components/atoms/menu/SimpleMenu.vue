<script setup lang="ts" generic="T">
import { useTemplateRef } from "vue";

import { useMenuNavigation } from "@/composables/local";

import {
  MenuItem,
  Text,
  type IMenuItem,
  type SimpleMenuProps,
} from "@/components/atoms";

const PREFIX = "simple-menu";

const props = withDefaults(defineProps<SimpleMenuProps<T>>(), {
  variant: "default",
  size: "lg",
  orientation: "horizontal",
});

const emit = defineEmits<{
  (e: "select", item: IMenuItem<T>): void;
  (e: "update:selected-item-id", id: number): void;
}>();

const refRoot = useTemplateRef<HTMLDivElement | null>("root");

useMenuNavigation({
  root: refRoot,
  orientation: props.orientation,
});

const onPress = (item: IMenuItem<T>): void => {
  emit("select", item);

  const { id } = item;
  emit("update:selected-item-id", id);
};

/* * * Keyboard * * */
</script>

<template>
  <div
    ref="root"
    :class="[
      PREFIX,
      `${PREFIX}_variant-${variant}`,
      `${PREFIX}_size-${size}`,
      `${PREFIX}_orientation-${orientation}`,
    ]"
    :role="orientation === 'vertical' ? 'menu' : 'menubar'"
  >
    <MenuItem
      v-for="item in items"
      :key="item.id"
      v-memo="[item.id === selectedItemId]"
      :is-active="item.id === selectedItemId"
      role="menuitem"
      data-testid="simple-menu-item"
      :tabindex="item.id === selectedItemId ? 0 : -1"
      @is-pressed="onPress(item)"
    >
      <Text
        :as="'span'"
        :class="`${PREFIX}__item-label`"
        data-testid="simple-menu-item-label"
      >
        {{ item.label }}
      </Text>
    </MenuItem>
  </div>
</template>

<style lang="scss">
$prefix: simple-menu;

@mixin defineSizes($map: get($atoms, "#{$prefix}")) {
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
