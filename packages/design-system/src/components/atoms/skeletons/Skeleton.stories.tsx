import type { Meta, StoryObj } from "@storybook/vue3-vite";

import {
  skeletonModes,
  skeletonSizes,
  skeletonTones,
  skeletonVariants,
} from "@/adapters/atoms/skeleton";

import { enumOptions } from "@/stories";

import InfoBlock from "@/stories/components/atoms/blocks/InfoBlock.vue";
import StoryGrid from "@/stories/components/atoms/grids/StoryGrid.vue";
import PageHeader from "@/stories/components/atoms/headers/PageHeader.vue";

import { type SkeletonProps } from "@/components/atoms/skeletons/Skeleton";
import Skeleton from "@/components/atoms/skeletons/Skeleton.vue";

const meta = {
  title: "Atoms/Skeletons/Skeleton",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      ...enumOptions(skeletonVariants),
      table: { category: "Appearance" },
      description: "Visual style of the skeleton",
    },
    size: { ...enumOptions(skeletonSizes), table: { category: "Sizing" } },
    mode: { ...enumOptions(skeletonModes), table: { category: "Theme" } },
    tone: { ...enumOptions(skeletonTones), table: { category: "Theme" } },
    speed: {
      control: { type: "number", min: 0.25, max: 3, step: 0.25 },
      description: "Animation speed multiplier",
      table: { category: "Animation" },
    },
  },
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: "default",
    size: "md",
    mode: "neutral",
    tone: "primary",
    style: { height: "64px" },
    ariaLabel: "Loading content",
    ariaBusy: true,
  },
};

export const Size: Story = {
  args: {
    mode: "neutral",
    tone: "primary",
  },
  render: (args: SkeletonProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Skeleton size"}
            description={"Demonstrates variant and size"}
          ></PageHeader>
          <StoryGrid columns={1}>
            {skeletonVariants.map((variant) =>
              skeletonSizes.map((size) => (
                <InfoBlock
                  key={`${variant}${size}`}
                  title={`${variant} / ${size}`}
                  align={"center"}
                  orientation={"vertical"}
                >
                  <Skeleton
                    {...args}
                    variant={variant}
                    size={size}
                    style={{ height: "64px" }}
                  ></Skeleton>
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
    variant: "rounded",
    size: "md",
  },
  render: (args: SkeletonProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Skeleton size"}
            description={"Demonstrates mode and tone"}
          ></PageHeader>
          <StoryGrid columns={1}>
            {skeletonModes.map((mode) =>
              skeletonTones.map((tone) => (
                <InfoBlock
                  key={`${mode}${tone}`}
                  title={`${mode} / ${tone}`}
                  align={"center"}
                  orientation={"vertical"}
                >
                  <Skeleton
                    {...args}
                    mode={mode}
                    tone={tone}
                    style={{ height: "64px" }}
                  ></Skeleton>
                </InfoBlock>
              ))
            )}
          </StoryGrid>
        </>
      );
    },
  }),
};
