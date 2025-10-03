<script setup lang="ts">
import { onMounted, ref, watch, toValue, useTemplateRef } from "vue";
import g from "gsap";

import { useClickOutside } from "@/composables/local";

import { Icon } from "@/components/atoms";
import { type DropdownProps } from "@/components/molecules";

const PREFIX = "dropdown";

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

const isExpanded = ref(false);

useClickOutside(refRoot, () => {
  isExpanded.value = false;
});

const onExpand = (): void => {
  isExpanded.value = !isExpanded.value;
};

/* * * Animations * * */

const getIcon = (): HTMLDivElement | null => {
  if (!refRoot.value) return null;
  return refRoot.value.getElementsByClassName(
    "dropdown__current-value-icon"
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
  g.fromTo(
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
  g.to(el, {
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
  if (props.closeOnOptionClick) isExpanded.value = false;
};
</script>

<script lang="ts"></script>

<template>
  <div
    ref="root"
    role="menu"
    data-testid="dropdown"
    :class="[
      PREFIX,
      {
        [`${PREFIX}_variant-${variant}`]: !!variant,
        [`${PREFIX}_size-${size}`]: !!size,
        [`${PREFIX}_mode-${mode}`]: !!mode,
        [`${PREFIX}_tone-${tone}`]: !!tone,
      },
      `${PREFIX}_state-${isExpanded ? 'expanded' : 'normal'}`,
    ]"
    :aria-expanded="isExpanded"
  >
    <div
      :class="`${PREFIX}__current-value`"
      data-testid="dropdown-value"
      aria-haspopup="listbox"
      @click="onExpand"
    >
      <div :class="`${PREFIX}__current-value-container`">
        <div :class="`${PREFIX}__current-value-content`">
          <span :class="`${PREFIX}__current-value-label`">
            {{ value }}
          </span>
          <span v-if="valuePostfix" :class="`${PREFIX}__current-value-postfix`">
            {{ valuePostfix }}
          </span>
        </div>
        <Icon
          :class="`${PREFIX}__current-value-icon`"
          :name="'down'"
          :appearance="'outline'"
          :weight="'500'"
        ></Icon>
      </div>
    </div>
    <Transition :css="false">
      <div
        v-if="isExpanded"
        :class="`${PREFIX}__options`"
        @click="onOptionClick"
      >
        <div v-if="$slots.controlbar" :class="`${PREFIX}__controlbar`">
          <slot name="controlbar"></slot>
        </div>
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
$prefix: "dropdown";

@mixin defineSizes($map: get($components, "molecules.#{$prefix}")) {
  @each $variant, $sizes in $map {
    @each $size, $val in $sizes {
      $min-width: px2rem(get($val, "root.min-width"));
      $height: px2rem(get($val, "root.height"));

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
            }
          }

          &.#{$prefix}_state-expanded {
            .#{$prefix}__current-value {
              border-radius: $value-border-radius $value-border-radius 0 0;
            }
          }

          .#{$prefix}__current-value {
            height: $height;
            gap: $value-gap;
            padding: $value-padding;

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
          }
        }
      }
    }
  }
}

@mixin defineThemes(
  $map: get($themes, "light.components.molecules.#{$prefix}")
) {
  @each $mode, $modes in $map {
    @each $tone, $val in $modes {
      &_mode-#{$mode} {
        &.#{$prefix}_tone-#{$tone} {
          &.#{$prefix}_state-normal {
            .#{$prefix}__current-value {
              @include themify($themes) {
                background-color: themed(
                  "components.molecules.#{$prefix}.#{$mode}.#{$tone}.current-value.background.normal"
                );
              }

              &-label {
                @include themify($themes) {
                  color: themed(
                    "components.molecules.#{$prefix}.#{$mode}.#{$tone}.current-value.label.normal"
                  );
                }
              }

              &-icon {
                @include themify($themes) {
                  fill: themed(
                    "components.molecules.#{$prefix}.#{$mode}.#{$tone}.current-value.icon.normal"
                  );
                }
              }

              &:hover {
                @include themify($themes) {
                  background-color: themed(
                    "components.molecules.#{$prefix}.#{$mode}.#{$tone}.current-value.background.hovered"
                  );
                }

                &-label {
                  @include themify($themes) {
                    color: themed(
                      "components.molecules.#{$prefix}.#{$mode}.#{$tone}.current-value.label.hovered"
                    );
                  }
                }

                &-icon {
                  @include themify($themes) {
                    fill: themed(
                      "components.molecules.#{$prefix}.#{$mode}.#{$tone}.current-value.icon.hovered"
                    );
                  }
                }
              }
            }
          }

          &.dropdown_state-expanded {
            .dropdown__current-value {
              @include themify($themes) {
                background-color: themed(
                  "components.molecules.#{$prefix}.#{$mode}.#{$tone}.current-value.background.expanded"
                );
              }

              &-label {
                @include themify($themes) {
                  color: themed(
                    "components.molecules.#{$prefix}.#{$mode}.#{$tone}.current-value.label.expanded"
                  );
                }
              }

              &-icon {
                @include themify($themes) {
                  fill: themed(
                    "components.molecules.#{$prefix}.#{$mode}.#{$tone}.current-value.icon.expanded"
                  );
                }
              }

              &:hover {
                @include themify($themes) {
                  background-color: themed(
                    "components.molecules.#{$prefix}.#{$mode}.#{$tone}.current-value.background.expanded-hovered"
                  );
                }

                &-label {
                  @include themify($themes) {
                    color: themed(
                      "components.molecules.#{$prefix}.#{$mode}.#{$tone}.current-value.label.expanded-hovered"
                    );
                  }
                }

                &-icon {
                  @include themify($themes) {
                    fill: themed(
                      "components.molecules.#{$prefix}.#{$mode}.#{$tone}.current-value.icon.expanded-hovered"
                    );
                  }
                }
              }
            }

            .dropdown__options {
              @include themify($themes) {
                background-color: themed(
                  "components.molecules.#{$prefix}.#{$mode}.#{$tone}.options.background.normal"
                );
              }

              &:hover {
                @include themify($themes) {
                  background-color: themed(
                    "components.molecules.#{$prefix}.#{$mode}.#{$tone}.options.background.hovered"
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
    .#{$prefix}__current-value {
      @extend %base-transition;
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

  .#{$prefix}__current-value,
  .#{$prefix}__options {
    @include transition(
      color background background-color fill stroke opacity,
      150ms,
      ease-out
    );
  }
}
</style>
