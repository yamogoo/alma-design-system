import type { Meta, StoryObj } from "@storybook/vue3";

import { enumOptions } from "@/stories/utils";

import {
  charTooltipLabelModes,
  charTooltipLabelSizes,
  charTooltipLabelTones,
  charTooltipLabelVariants,
} from "@/adapters";

import StoryGrid from "@/stories/components/atoms/grids/StoryGrid.vue";
import PageHeader from "@/stories/components/atoms/headers/PageHeader.vue";
import InfoBlock from "@/stories/components/atoms/blocks/InfoBlock.vue";

import {
  iconNames,
  iconStyles,
  iconWeights,
} from "@/components/atoms/icons/Icon";

import type { CharTooltipLabelProps } from "./CharTooltipLabel";
import CharTooltipLabel from "./CharTooltipLabel.vue";

const meta = {
  title: "Atoms/Tooltips/CharTooltipLabel",
  component: CharTooltipLabel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Small label pill for single characters or icons, themed by mode/tone and sized via tokens.",
        story: "Interactive playground to explore size and color tokens.",
      },
    },
  },
  argTypes: {
    variant: enumOptions(charTooltipLabelVariants),
    size: enumOptions(charTooltipLabelSizes),
    mode: enumOptions(charTooltipLabelModes),
    tone: enumOptions(charTooltipLabelTones),
    label: { control: "text" },
    iconName: enumOptions(iconNames),
    iconStyle: enumOptions(iconStyles),
    iconWeight: enumOptions(iconWeights),
  },
  args: {
    variant: "default",
    size: "lg",
    mode: "neutral",
    tone: "primary",
    label: "A",
    iconName: "check",
    iconStyle: "outline",
    iconWeight: "400",
  },
} satisfies Meta<typeof CharTooltipLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Size: Story = {
  render: (args: CharTooltipLabelProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"CharTooltipLabel size"}
            description={"Demonstrates available variants and sizes"}
          ></PageHeader>
          <StoryGrid columns={1}>
            {charTooltipLabelVariants.map((variant) =>
              charTooltipLabelSizes.map((size) => (
                <InfoBlock
                  key={`${variant}${size}`}
                  title={`${variant} / ${size}`}
                  align={"center"}
                  orientation={"vertical"}
                >
                  <CharTooltipLabel
                    {...args}
                    variant={variant}
                    size={size}
                    label={"A"}
                  ></CharTooltipLabel>
                </InfoBlock>
              ))
            )}
          </StoryGrid>
        </>
      );
    },
  }),
};

export const Color: Story = {
  args: {
    variant: "default",
  },
  render: (args: CharTooltipLabelProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"CharTooltipLabel colors"}
            description={"Demonstrates mode and tone combinations"}
          ></PageHeader>
          <StoryGrid columns={1}>
            {charTooltipLabelModes.map((mode) =>
              charTooltipLabelTones.map((tone) => (
                <InfoBlock
                  key={`${mode}${tone}`}
                  title={`${mode} / ${tone}`}
                  align={"center"}
                  orientation={"vertical"}
                >
                  <CharTooltipLabel
                    {...args}
                    mode={mode}
                    tone={tone}
                    label={"A"}
                  ></CharTooltipLabel>
                </InfoBlock>
              ))
            )}
          </StoryGrid>
        </>
      );
    },
  }),
};
