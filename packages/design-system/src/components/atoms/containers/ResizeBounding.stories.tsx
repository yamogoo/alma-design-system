import { ref, watchEffect } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3";

import {
  resizeBoundingModes,
  resizeBoundingSizes,
  resizeBoundingTones,
  resizeBoundingVariants,
} from "@/adapters";

import {
  booleanOptions,
  enumOptions,
  numberOptions,
  stringOptions,
} from "@/stories/utils";

import { StoryGrid, StorySlotCover } from "@/stories/components";
import { ResizeBounding, type ResizeBoundingProps } from "@/components/atoms";

const meta = {
  title: "Atoms/Containers/ResizeBounding",
  component: ResizeBounding,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "ResizeBounding is a lightweight Vue 3 wrapper around **vue3-resize-bounding**, providing draggable split panes and resizable containers with an intuitive API.",
        story:
          "Interactive playground to explore resizing behavior, directional constraints, and container nesting.",
      },
    },
  },
  argTypes: {
    variant: enumOptions(resizeBoundingVariants),
    size: enumOptions(resizeBoundingSizes),
    mode: enumOptions(resizeBoundingModes),
    tone: enumOptions(resizeBoundingTones),
    width: numberOptions(),
    minWidth: numberOptions(),
    maxWidth: numberOptions(),
    height: numberOptions(),
    minHeight: numberOptions(),
    maxHeight: numberOptions(),
    directions: stringOptions("rtlb"),
    disabled: booleanOptions(false),
  },
  args: {
    variant: "default",
    size: "md",
    mode: "accent",
    tone: "primary",
    width: 320,
    minWidth: 240,
    height: 480,
    minHeight: 240,
    maxWidth: Number.POSITIVE_INFINITY,
    maxHeight: Number.NEGATIVE_INFINITY,
    directions: "hv",
    disabled: false,
  },
} satisfies Meta<typeof ResizeBounding>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    directions: "hv",
    minWidth: 240,
    minHeight: 240,
  },
  render: (args: ResizeBoundingProps) => ({
    setup() {
      const width = ref(args.width);
      const height = ref(args.height);

      watchEffect(() => {
        width.value = args.width;
      });

      watchEffect(() => {
        height.value = args.height;
      });

      return () => (
        <>
          <StoryGrid columns={1}>
            <ResizeBounding
              {...args}
              width={width.value}
              height={height.value}
              onUpdate:width={(value: number) => {
                width.value = value;
              }}
              onUpdate:height={(value: number) => {
                height.value = value;
              }}
            >
              <StorySlotCover></StorySlotCover>
            </ResizeBounding>
          </StoryGrid>
        </>
      );
    },
  }),
};
