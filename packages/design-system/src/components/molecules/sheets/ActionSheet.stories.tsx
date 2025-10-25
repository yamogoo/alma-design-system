import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { booleanOptions, enumOptions } from "@/stories/utils";

import {
  actionSheetSizes,
  actionSheetVariants,
} from "@/adapters/molecules/actionSheet";

import {
  UIElementAlignments,
  UIElementBlockTags,
  UIElementDirections,
  UIElementOrientations,
  UIElementStretches,
} from "@/typings";

import StoryGrid from "@/stories/components/atoms/grids/StoryGrid.vue";
import StorySlotCover from "@/stories/components/molecules/covers/StorySlotCover.vue";
// import PageHeader from "@/stories/components/atoms/headers/PageHeader.vue";
// import InfoBlock from "@/stories/components/atoms/blocks/InfoBlock.vue";

import type { ActionSheetProps } from "./ActionSheet";
import ActionSheet from "./ActionSheet.vue";
import ActionButton from "@/components/molecules/buttons/aliases/ActionButton.vue";

const meta = {
  title: "Molecules/Sheets/ActionSheet",
  component: ActionSheet,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "ActionSheets are the primary positioning containers that organize and align multiple components within a layout.",
        story:
          "Interactive playground to explore orientation, size, and color tokens.",
      },
    },
  },
  argTypes: {
    as: enumOptions(UIElementBlockTags),
    variant: enumOptions(actionSheetVariants),
    size: enumOptions(actionSheetSizes),
    orientation: enumOptions(UIElementOrientations),
    direction: enumOptions(UIElementDirections),
    alignVertical: enumOptions(UIElementAlignments),
    alignHorizontal: enumOptions(UIElementAlignments),
    stretch: enumOptions(UIElementStretches),
    wrap: booleanOptions(false),
    divider: booleanOptions(false),
  },
  args: {
    size: "md",
    mode: "neutral",
    tone: "canvas",
    alignHorizontal: "start",
    alignVertical: "start",
  },
} satisfies Meta<typeof ActionSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    isOpen: false,
  },
  render: (args: ActionSheetProps) => ({
    setup() {
      const localIsOpen = ref(args.isOpen);

      const onOpenSheet = (): void => {
        localIsOpen.value = !localIsOpen.value;
      };

      return () => (
        <>
          <StoryGrid columns={1} style={{ width: "100%", height: "360px" }}>
            <ActionButton
              variant="default"
              size="md"
              mode="neutral"
              tone="primary"
              label="open sheet"
              stretch="row"
              onRelease={onOpenSheet}
            ></ActionButton>
            <ActionSheet
              {...args}
              containerId="body"
              variant="default"
              size="lg"
              mode="neutral"
              tone="secondary"
              v-model:is-open={localIsOpen.value}
              title="Header title"
            >
              <StorySlotCover style={{ height: "880px" }}></StorySlotCover>
            </ActionSheet>
          </StoryGrid>
        </>
      );
    },
  }),
};
