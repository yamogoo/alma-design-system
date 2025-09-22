<script setup lang="ts">
import Resizer, { globalClassNames } from "vue3-resize-bounding";

import tokens from "@/tokens";

import { type ResizeBoundingProps } from "@/components/atoms";

const PREFIX = "resizer",
  PREFIX_WITH_DIVIDER = `${PREFIX}__`;

const props = withDefaults(defineProps<ResizeBoundingProps>(), {
  variant: "default",
});

const emits = defineEmits<{
  (e: "update:width", width: number): void;
  (e: "update:height", height: number): void;
}>();

const variant = props.variant;

const knobWidth = tokens.atoms.resizer[variant].knob.width.$value;
const knobHeight = tokens.atoms.resizer[variant].knob.height.$value;
const knobRoundness = tokens.atoms.resizer[variant].knob.borderRadius.$value;
const activeAreaWidth =
  tokens.atoms.resizer[variant].self.activeAreaWidth.$value;
</script>

<template>
  <Resizer
    v-bind="props"
    data-testid="resizer"
    :class="`${PREFIX}_variant-${variant}`"
    :options="{
      prefix: PREFIX_WITH_DIVIDER,
      width: 4,
      splitterWidthNormal: 4,
      splitterWidthActive: 4,
      activeAreaWidth,
      position: 'internal',
      knob: {
        show: false,
      },
      touchActions: true,
    }"
    :styles="{
      knob: [
        globalClassNames(PREFIX_WITH_DIVIDER).knob,
        {
          width: knobWidth,
          height: knobHeight,
          borderRadius: knobRoundness,
          transition: 'background 75ms ease-out',
        },
      ],
    }"
    @update:width="(width) => emits('update:width', width)"
    @update:height="(height) => emits('update:height', height)"
  >
    <slot></slot>
  </Resizer>
</template>

<style lang="scss">
$prefix: "resizer__";

.#{$prefix} {
  &knob {
    width: 128px;
    height: 4px;
  }
  &pane {
    // normal state:
    .#{$prefix}splitter {
      @include themify($themes) {
        background: rgba(themed("atoms.resizer.default.splitter.normal"), 0);
      }
    }

    .#{$prefix}knob {
      @include themify($themes) {
        background: themed("atoms.resizer.default.knob.normal");
      }
    }

    // selected pane:
    &.active {
      .#{$prefix}splitter {
        @include themify($themes) {
          background: rgba(themed("atoms.resizer.default.splitter.active"), 1);
        }
      }
    }
  }

  &splitter {
    @include transition(background, 125ms, ease-out);
  }
}
</style>
