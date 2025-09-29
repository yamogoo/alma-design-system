import type { Meta, StoryObj } from "@storybook/vue3";

import { booleanOptions, enumOptions } from "@/stories/utils";

import { StoryGrid, InfoBlock, PageHeader } from "@/stories/components";

import type { SliderProps } from "./Slider";
import Slider from "./Slider.vue";

import {
  sliderModes,
  sliderSizes,
  sliderTones,
  sliderVariants,
} from "@/adapters";

const meta = {
  title: "Atoms/Toggles/Slider/Slider",
  tags: ["autodocs"],
  component: Slider,
  parameters: {
    docs: {
      description: {
        component:
          "A flexible range slider component that supports steps, snapping, keyboard navigation, and custom themes. Designed to work seamlessly with tokens and modes from the design system.",
        story:
          "Use the playground to interactively explore slider orientation, size, tones, and snapping behavior.",
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
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground for experimenting with props such as steps, snapping, and disabled state.",
      },
    },
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
            title="Slider sizes"
            description="Demonstrates how different size tokens and variants affect the appearance and spacing of the slider."
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
            title="Slider colors"
            description="Shows the effect of mode and tone combinations on the slider track, knob, and range fill."
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
