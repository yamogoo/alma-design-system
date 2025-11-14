<script setup lang="ts" generic="T = string">
import { computed, useTemplateRef } from "vue";
import { useFacetsClasses } from "@/composables/local/components/useFacetsClasses";

import { UIFACETS, UISTATES } from "@/constants/ui";

import { useHover } from "@/composables/local/actions/useHover";

import { TAB_ITEM_PREFIX, type TabbarItemProps } from "./TabbarItem";
import Icon from "@/components/atoms/icons/Icon.vue";
import Text from "@/components/atoms/typography/Text.vue";

const props = withDefaults(defineProps<TabbarItemProps>(), {
  iconStyle: "outline",
  iconWeight: "400",
});

const emit = defineEmits<{
  (e: "select"): void;
}>();

const root = useTemplateRef<HTMLElement | null>("root");

const { classes: facetClasses } = useFacetsClasses({
  prefix: TAB_ITEM_PREFIX,
  props: props,
});

const { isHovered } = useHover(root);

const effectiveState = computed(() => {
  if (!props.isActive) {
    return isHovered.value ? UISTATES.HOVERED : UISTATES.NORMAL;
  }
  if (props.isActive) return UISTATES.SELECTED;
});

const onClick = (): void => {
  emit("select");
};
</script>

<template>
  <component
    :is="as"
    ref="root"
    :class="[
      facetClasses,
      `${TAB_ITEM_PREFIX}_${UIFACETS.STATE}-${effectiveState}`,
    ]"
    role="tab"
    :aria-label="label"
    @click="onClick"
  >
    <Icon
      v-if="iconName"
      :class="[`${TAB_ITEM_PREFIX}__icon`]"
      :name="iconName"
      :appearance="iconStyle"
      :weight="iconWeight"
    ></Icon>
    <Text :class="[`${TAB_ITEM_PREFIX}__label`]">{{ label }}</Text>
  </component>
</template>

<style lang="scss">
$rootTokenName: "tabbar";
$rootPrefix: getPrefix($rootTokenName);
$tokenName: "tabbar-item";
$prefix: getPrefix("tabbar-item");

@mixin defineSizes($map: get($components, "molecules.#{$rootTokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      &_variant-#{$variant} {
        &.#{$rootPrefix}_size-#{$size} {
          $gap: get($val, "item.root.gap");
          $padding: get($val, "item.root.padding");

          $label-font-style: get($val, "item.label.font-style");

          --#{$prefix}--gap: #{$gap};
          --#{$prefix}--padding: #{$padding};

          .#{$prefix}__label {
            @extend %t__#{$label-font-style};
          }
        }
      }
    }
  }
}

@mixin defineStates($_prefix, $mode, $tone, $state) {
  &.#{$prefix}_state-#{$state} {
    // @include themify($themes) {
    //   background-color: themed(
    //     "components.molecules.#{$_prefix}.#{$mode}.#{$tone}.item.root.background.#{$state}"
    //   );
    // }

    @debug $prefix;
    .#{$prefix}__icon {
      @include themify($themes) {
        fill: themed(
          "components.molecules.#{$_prefix}.#{$mode}.#{$tone}.item.icon.#{$state}"
        );
      }
    }

    .#{$prefix}__label {
      @include themify($themes) {
        color: themed(
          "components.molecules.#{$_prefix}.#{$mode}.#{$tone}.item.label.#{$state}"
        );
      }
    }
  }
}

@mixin defineThemes(
  $map: get($themes, "light.components.molecules.#{$rootTokenName}")
) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.#{$rootPrefix}_tone-#{$tone} {
          .#{$prefix} {
            @each $state in ("normal", "hovered", "selected") {
              @include defineStates($rootTokenName, $mode, $tone, $state);
            }
          }
        }
      }
    }
  }
}

.#{$rootPrefix} {
  @include defineSizes();
  @include defineThemes();

  .#{$prefix} {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--#{$prefix}--gap, 0);
    width: 100%;
    padding: var(--#{$prefix}--padding, 0);
    border-radius: inherit;
    z-index: 1;
    cursor: pointer;
  }
}
</style>
