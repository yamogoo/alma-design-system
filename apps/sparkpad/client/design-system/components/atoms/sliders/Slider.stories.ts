import type { Meta, StoryObj } from "@storybook/vue3";

import { StoryGrid, InfoBlock, PageHeader } from "@/stories/components";

import { Slider } from "@/components/atoms";

const meta = {
  title: "Atoms/Sliders/RangeSlider",
  argTypes: {
    value: {
      type: "number",
    },
    min: {
      type: "number",
      defaultValue: 0,
    },
    max: {
      type: "number",
    },
    step: {
      type: "number",
    },
    label: {
      type: "string",
    },
    knobSize: {
      type: "number",
    },
  },
  component: Slider,
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    value: 50,
    max: 100,
  },
};
