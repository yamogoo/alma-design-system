<script setup lang="ts">
import {
  nextTick,
  onMounted,
  ref,
  watch,
  toValue,
  useTemplateRef,
  useId,
} from "vue";

import { UIFACETS, UISTATES } from "@/constants/ui";

import { useFacetsClasses } from "@/composables/local/components/useFacetsClasses";

import { useClickOutside } from "@/composables/local/actions/useClickOutside";

import Icon from "@/components/atoms/icons/Icon.vue";
import {
  DROPDOWN_PREFIX,
  type DropdownProps,
} from "@/components/molecules/dropdown/Dropdown";

import gsap from "gsap";

const ARROW_ICON_ROTATION_EXPANDED = 0,
  ARROW_ICON_ROTATION_SHRINKED = 90;

const EXPAND_ARROW_ICON_DURATION_IN = 0.25,
  EXPAND_ARROW_ICON_DURATION_OUT = 0.15;

const props = withDefaults(defineProps<DropdownProps>(), {
  variant: "default",
  size: "md",
  mode: "neutral",
  tone: "primary",
  isResetButtonShown: false,
});

const refRoot = useTemplateRef<HTMLDivElement | null>("root");
const refTrigger = useTemplateRef<HTMLButtonElement | null>("trigger");
const refOptions = useTemplateRef<HTMLDivElement | null>("options");

const isExpanded = ref(false);

const { classes: facetClasses } = useFacetsClasses({
  prefix: DROPDOWN_PREFIX,
  props: props,
  facets: [UIFACETS.VARIANT, UIFACETS.SIZE, UIFACETS.MODE, UIFACETS.TONE],
});

useClickOutside(refRoot, () => {
  if (!isExpanded.value) return;
  void closeOptions(false);
});

const openOptions = async () => {
  if (isExpanded.value) return;
  isExpanded.value = true;
  await nextTick();
  refOptions.value?.focus();
};

const closeOptions = async (shouldFocusTrigger = true) => {
  if (!isExpanded.value) return;
  isExpanded.value = false;
  if (!shouldFocusTrigger) return;
  await nextTick();
  refTrigger.value?.focus();
};

const toggleOptions = async () => {
  if (isExpanded.value) {
    await closeOptions();
    return;
  }
  await openOptions();
};

/* * * a11y * * */

const idSuffix = useId();
const triggerId = `${DROPDOWN_PREFIX}_trigger-${idSuffix}`;
const optionsId = `${DROPDOWN_PREFIX}_options-${idSuffix}`;

/* * * Animations * * */

const getIcon = (): HTMLDivElement | null => {
  if (!refRoot.value) return null;
  return refRoot.value.getElementsByClassName(
    `${DROPDOWN_PREFIX}__current-value-icon`
  )[0] as HTMLDivElement;
};

const setIconState = (isExpanded: boolean, isAnimate = true): void => {
  const el = getIcon();
  if (el)
    isExpanded
      ? onAnimExpandIconIn(el, isAnimate ? EXPAND_ARROW_ICON_DURATION_IN : 0)
      : onAnimExpandIconOut(el, isAnimate ? EXPAND_ARROW_ICON_DURATION_OUT : 0);
};

const onAnimExpandIconIn = (el: HTMLDivElement, duration: number): void => {
  gsap.fromTo(
    el,
    {
      rotate: ARROW_ICON_ROTATION_SHRINKED,
    },
    {
      rotate: ARROW_ICON_ROTATION_EXPANDED,
      duration,
      ease: "power4.out",
    }
  );
};

const onAnimExpandIconOut = (el: HTMLDivElement, duration: number): void => {
  gsap.to(el, {
    rotate: ARROW_ICON_ROTATION_SHRINKED,
    duration,
    ease: "power4.in",
  });
};

/* * * Options * * */

onMounted(() => {
  setIconState(toValue(isExpanded), false);
});

watch(
  isExpanded,
  (newIsExpanded) => {
    setIconState(newIsExpanded);
  },
  { immediate: true }
);

const onOptionClick = (): void => {
  if (props.closeOnOptionClick) void closeOptions();
};

/* * * Keyboard * * */

const onTriggerKeydown = async (event: KeyboardEvent) => {
  switch (event.key) {
    case "Enter":
    case " ":
      event.preventDefault();
      await toggleOptions();
      break;
    case "ArrowDown":
    case "ArrowUp":
      event.preventDefault();
      await openOptions();
      break;
    case "Escape":
      event.preventDefault();
      await closeOptions();
      break;
  }
};

const onOptionsKeydown = async (event: KeyboardEvent) => {
  switch (event.key) {
    case "Escape":
      event.preventDefault();
      await closeOptions();
      break;
    case "Tab":
      await closeOptions(false);
      break;
  }
};
</script>

<script lang="ts"></script>

<template>
  <div
    ref="root"
    :data-testid="DROPDOWN_PREFIX"
    :class="[
      facetClasses,
      `${DROPDOWN_PREFIX}_${UIFACETS.STATE}-${isExpanded ? UISTATES.EXPANDED : UISTATES.NORMAL}`,
    ]"
  >
    <button
      ref="trigger"
      :class="`${DROPDOWN_PREFIX}__current-value`"
      :data-testid="`${DROPDOWN_PREFIX}__value`"
      aria-haspopup="listbox"
      :aria-controls="optionsId"
      :aria-expanded="isExpanded"
      :id="triggerId"
      type="button"
      @click="toggleOptions"
      @keydown="onTriggerKeydown"
    >
      <div :class="`${DROPDOWN_PREFIX}__current-value-container`">
        <div :class="`${DROPDOWN_PREFIX}__current-value-content`">
          <span :class="`${DROPDOWN_PREFIX}__current-value-label`">
            {{ value }}
          </span>
          <span
            v-if="valuePostfix"
            :class="`${DROPDOWN_PREFIX}__current-value-postfix`"
          >
            {{ valuePostfix }}
          </span>
        </div>
        <Icon
          :class="`${DROPDOWN_PREFIX}__current-value-icon`"
          :name="'down'"
          :appearance="'outline'"
          :weight="'500'"
        ></Icon>
      </div>
    </button>
    <Transition :css="false">
      <div
        v-if="isExpanded"
        ref="options"
        :id="optionsId"
        :class="`${DROPDOWN_PREFIX}__options`"
        role="listbox"
        :aria-labelledby="triggerId"
        tabindex="0"
        @click="onOptionClick"
        @keydown="onOptionsKeydown"
      >
        <div v-if="$slots.controlbar" :class="`${DROPDOWN_PREFIX}__controlbar`">
          <slot name="controlbar"></slot>
        </div>
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
$tokenName: "dropdown";
$prefix: getPrefix($tokenName);

@mixin defineSizes($map: get($components, "molecules.#{$tokenName}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $min-width: px2rem(get($val, "root.min-width"));
      $height: px2rem(get($val, "root.height"));
      $border-width: px2rem(get($val, "root.border-width"));

      $value-gap: px2rem(get($val, "current-value.root.gap"));
      $value-padding: get($val, "current-value.root.padding");
      $value-border-radius: px2rem(
        get($val, "current-value.root.border-radius")
      );
      $value-font-style: get($val, "current-value.label.font-style");
      $value-icon-size: px2rem(get($val, "current-value.icon.size"));

      $options-border-radius: px2rem(get($val, "options.border-radius"));
      $options-padding: get($val, "options.padding");

      &_variant-#{$variant} {
        &.#{$prefix}_size-#{$size} {
          min-width: $min-width;

          &.#{$prefix}_state-normal {
            .#{$prefix}__current-value {
              border-radius: $value-border-radius;
              border-width: $border-width;
            }
          }

          &.#{$prefix}_state-expanded {
            .#{$prefix}__current-value {
              border-radius: $value-border-radius $value-border-radius 0 0;
              border-width: $border-width;
            }
          }

          .#{$prefix}__current-value {
            height: $height;
            gap: $value-gap;
            padding: $value-padding;

            border-style: solid;

            &-label {
              @extend %t__#{$value-font-style};
            }

            &-icon {
              @include box($value-icon-size);
            }
          }

          .#{$prefix}__options {
            padding: $options-padding;
            border-radius: 0 0 $options-border-radius $options-border-radius;
            border-left-width: $border-width;
            border-bottom-width: $border-width;
            border-right-width: $border-width;
            border-style: solid;
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
          .#{$prefix}__current-value {
            &:focus {
              outline: none;
            }

            &:focus-visible {
              @include themify($themes) {
                outline: get($tokens, "outline") solid
                  themed(
                    "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.root.highlight"
                  );
              }
            }
          }

          &.#{$prefix}_state-normal {
            .#{$prefix}__current-value {
              @include themify($themes) {
                $border-color: themed(
                  "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.current-value.border.normal"
                );

                background-color: themed(
                  "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.current-value.background.normal"
                );
                border-color: $border-color;
              }

              &-label {
                @include themify($themes) {
                  color: themed(
                    "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.current-value.label.normal"
                  );
                }
              }

              &-icon {
                @include themify($themes) {
                  fill: themed(
                    "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.current-value.icon.normal"
                  );
                }
              }

              &:hover {
                @include themify($themes) {
                  background-color: themed(
                    "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.current-value.background.hovered"
                  );
                }

                &-label {
                  @include themify($themes) {
                    color: themed(
                      "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.current-value.label.hovered"
                    );
                  }
                }

                &-icon {
                  @include themify($themes) {
                    fill: themed(
                      "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.current-value.icon.hovered"
                    );
                  }
                }
              }
            }
          }

          &.#{$prefix}_state-expanded {
            .#{$prefix}__current-value {
              @include themify($themes) {
                $border-color: themed(
                  "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.current-value.border.expanded"
                );

                background-color: themed(
                  "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.current-value.background.expanded"
                );
                border-left-color: $border-color;
                border-top-color: $border-color;
                border-right-color: $border-color;
                border-bottom-color: rgba($border-color, 0);
              }

              &-label {
                @include themify($themes) {
                  color: themed(
                    "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.current-value.label.expanded"
                  );
                }
              }

              &-icon {
                @include themify($themes) {
                  fill: themed(
                    "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.current-value.icon.expanded"
                  );
                }
              }

              &:hover {
                @include themify($themes) {
                  background-color: themed(
                    "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.current-value.background.expanded-hovered"
                  );
                }

                &-label {
                  @include themify($themes) {
                    color: themed(
                      "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.current-value.label.expanded-hovered"
                    );
                  }
                }

                &-icon {
                  @include themify($themes) {
                    fill: themed(
                      "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.current-value.icon.expanded-hovered"
                    );
                  }
                }
              }
            }

            .#{$prefix}__options {
              @include themify($themes) {
                background-color: themed(
                  "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.options.background.normal"
                );
                $border-color: themed(
                  "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.current-value.border.expanded"
                );
                border-color: $border-color;
              }

              &:hover {
                @include themify($themes) {
                  background-color: themed(
                    "components.molecules.#{$tokenName}.#{$mode}.#{$tone}.options.background.hovered"
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
  box-sizing: border-box;
  position: relative;
  user-select: none;
  direction: ltr;

  @include defineSizes();
  @include defineThemes();

  &__current-value {
    box-sizing: border-box;
    align-content: center;
    width: 100%;
    cursor: pointer;

    &-label {
      display: block;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      flex: 1 0 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    span,
    .#{$prefix}__expand-icon,
    .#{$prefix}__reset-icon,
    .#{$prefix}__current-value,
    .#{$prefix}__options {
      @include useThemeTransition();
    }
  }

  &__current-value {
    &-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: px2rem(get($tokens, "spacing.xs"));
      width: 100%;
      overflow: hidden;
    }

    &-content {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: px2rem(get($tokens, "spacing.xs"));
    }
  }

  &__controlbar {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: px2rem(get($tokens, "spacing.xs"));
  }

  &__options {
    box-sizing: border-box;
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-height: 332px;
    overflow: auto;
    z-index: 9999;

    &__content {
      overflow: hidden;
    }
  }
}
</style>
