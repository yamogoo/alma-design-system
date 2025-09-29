import type { Meta, StoryObj } from "@storybook/vue3";

import { enumOptions } from "@/stories/utils";

import {
  surfaceModes,
  surfaceSizes,
  surfaceTones,
  surfaceVariants,
} from "@/adapters/atoms/surface";

import StoryGrid from "@/stories/components/atoms/grids/StoryGrid.vue";
import PageHeader from "@/stories/components/atoms/headers/PageHeader.vue";
import InfoBlock from "@/stories/components/atoms/blocks/InfoBlock.vue";
import StoryBox from "@/stories/components/atoms/blocks/StoryBox.vue";

import type { SurfaceProps } from "./Surface";
import Surface from "./Surface.vue";

const meta = {
  title: "Atoms/Containers/Surface",
  component: Surface,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A simple colored background with rounded corners. Color and rounding are controlled solely by design system tokens.",
        story: "Sandbox for choosing sleeves, size and colors (mode/tone).",
      },
    },
  },
  argTypes: {
    as: { control: "text" },
    variant: enumOptions(surfaceVariants),
    size: enumOptions(surfaceSizes),
    mode: enumOptions(surfaceModes),
    tone: enumOptions(surfaceTones),
  },
  args: {
    as: "div",
    variant: "default",
    size: "lg",
    mode: "neutral",
    tone: "secondary",
  },
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: SurfaceProps) => ({
    setup() {
      return () => (
        <StoryGrid columns={1}>
          <StoryBox>
            <Surface {...args}></Surface>
          </StoryBox>
        </StoryGrid>
      );
    },
  }),
};

export const Size: Story = {
  render: (args: SurfaceProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Surface size"}
            description={"Available options and sizes"}
          ></PageHeader>
          <StoryGrid columns={1}>
            {surfaceVariants.map((variant) =>
              surfaceSizes.map((size) => (
                <InfoBlock
                  key={`${variant}${size}`}
                  title={`${variant} / ${size}`}
                  align={"center"}
                  orientation={"vertical"}
                >
                  <StoryBox>
                    <Surface {...args} variant={variant} size={size}></Surface>
                  </StoryBox>
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
  render: (args: SurfaceProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Surface colors"}
            description={"Combinations of mode and tone"}
          ></PageHeader>
          <StoryGrid columns={1}>
            {surfaceModes.map((mode) =>
              surfaceTones.map((tone) => (
                <InfoBlock
                  key={`${mode}${tone}`}
                  title={`${mode} / ${tone}`}
                  align={"center"}
                  orientation={"vertical"}
                >
                  <StoryBox>
                    <Surface {...args} mode={mode} tone={tone}></Surface>
                  </StoryBox>
                </InfoBlock>
              ))
            )}
          </StoryGrid>
        </>
      );
    },
  }),
};
