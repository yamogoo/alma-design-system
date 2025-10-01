import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { enumOptions, booleanOptions } from "@/stories/utils";

import { UIElementAlignments } from "@/typings";

import StoryGrid from "@/stories/components/atoms/grids/StoryGrid.vue";
import PageHeader from "@/stories/components/atoms/headers/PageHeader.vue";
import InfoBlock from "@/stories/components/atoms/blocks/InfoBlock.vue";
import StorySlotCover from "@/stories/components/molecules/covers/StorySlotCover.vue";

import type { TooltipProps } from "./Tooltip";
import Tooltip from "./Tooltip.vue";

const meta = {
  title: "Atoms/Tooltips/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Tooltip shows contextual help on hover/focus over its slotted content.",
        story: "Interactive playground to explore alignment.",
      },
    },
  },
  argTypes: {
    align: enumOptions(UIElementAlignments),
    label: { control: "text" },
    isFollowingCursor: booleanOptions(false),
  },
  args: {
    align: "center",
    label: "Tooltip text",
    isFollowingCursor: false,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: TooltipProps) => ({
    setup() {
      return () => (
        <>
          <StoryGrid columns={1}>
            <Tooltip {...args}>
              <StorySlotCover
                title={"Hover me"}
                description={"Content block"}
              />
            </Tooltip>
          </StoryGrid>
        </>
      );
    },
  }),
};

export const Alignment: Story = {
  render: (args: TooltipProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Tooltip alignment"}
            description={"Demonstrates start, center and end alignments"}
          ></PageHeader>
          <StoryGrid columns={1}>
            {UIElementAlignments.map((align) => (
              <InfoBlock
                key={align}
                title={align}
                align={"center"}
                orientation={"vertical"}
              >
                <Tooltip {...args} align={align}>
                  <StorySlotCover
                    title={"Hover me"}
                    description={"Content block"}
                  />
                </Tooltip>
              </InfoBlock>
            ))}
          </StoryGrid>
        </>
      );
    },
  }),
};
