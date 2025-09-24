import type { Meta, StoryObj } from "@storybook/vue3";

import { booleanOptions, enumOptions } from "@/stories/utils";

import { StoryGrid, InfoBlock, PageHeader } from "@/stories/components";

import { Slider, type SliderProps } from "@/components/atoms";
import {
  sliderModes,
  sliderSizes,
  sliderTones,
  sliderVariants,
} from "~/design-system/adapters";

const meta = {
  title: "Atoms/Sliders/RangeSlider",
  tags: ["autodocs"],
  component: Slider,
  parameters: {
    docs: {
      description: {
        component:
          "Groups are the primary positioning containers that organize and align multiple components within a layout.",
        story:
          "Interactive playground to explore orientation, size, and color tokens.",
      },
    },
  },
  argTypes: {
    variant: enumOptions(sliderVariants),
    size: enumOptions(sliderSizes),
    mode: enumOptions(sliderModes),
    tone: enumOptions(sliderTones),
    value: {
      control: "number",
      type: "number",
    },
    min: {
      control: "number",
      type: "number",
      defaultValue: 0,
    },
    max: {
      control: "number",
      type: "number",
    },
    step: {
      control: "number",
      type: "number",
    },
    isSnapToStep: booleanOptions(false),
    snapThreshold: {
      control: "number",
      type: "number",
    },
    isDisabled: booleanOptions(false),
    isPageKeysEnabled: booleanOptions(false),
    knobAnimScaleActive: {
      control: "number",
      type: "number",
    },
    knobAnimScaleNormal: {
      control: "number",
      type: "number",
    },
    knobAnimDuration: {
      control: "number",
      type: "number",
    },
    label: {
      type: "string",
    },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    value: 50,
    max: 100,
  },
};

export const Size: Story = {
  args: {
    variant: "default",
    size: "md",
    mode: "accent",
    tone: "primary",
    value: 50,
    max: 100,
  },
  render: (args: SliderProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Slider size"}
            description={"Demonstrates variant and size"}
          ></PageHeader>
          <StoryGrid columns={2}>
            {sliderVariants.map((variant) =>
              sliderSizes.map((size) => (
                <InfoBlock
                  key={`${variant}${size}`}
                  title={`${variant} / ${size}`}
                  align={"center"}
                  orientation={"vertical"}
                >
                  <Slider {...args} variant={variant} size={size}></Slider>
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
    size: "md",
    mode: "accent",
    tone: "primary",
    value: 50,
    max: 100,
  },
  render: (args: SliderProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Slider colors"}
            description={"Demonstrates mode and tone"}
          ></PageHeader>
          <StoryGrid columns={2}>
            {sliderModes.map((mode) =>
              sliderTones.map((tone) => (
                <InfoBlock
                  key={`${mode}${tone}`}
                  title={`${mode} / ${tone}`}
                  align={"center"}
                  orientation={"vertical"}
                >
                  <Slider {...args} mode={mode} tone={tone}></Slider>
                </InfoBlock>
              ))
            )}
          </StoryGrid>
        </>
      );
    },
  }),
};
