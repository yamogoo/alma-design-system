import type { Meta, StoryObj } from "@storybook/vue3-vite";

import AnimatedIcon from "./AnimatedIcon.vue";

import spinnerAnimatedIcon from "@/assets/animations/spinner.json";

import { iconSizes, iconModes } from "@/adapters/atoms/icon";

const meta = {
  title: "Atoms/icons/AnimatedIcon",
  component: AnimatedIcon,
  tags: ["autodocs"],
  argTypes: {
    animationData: {
      control: "object",
      defaultValue: spinnerAnimatedIcon,
    },
    speed: {
      control: "number",
      defaultValue: 1,
    },
    isActive: {
      control: "boolean",
      defaultValue: true,
    },
    loop: {
      control: "boolean",
      defaultValue: true,
    },
    size: { control: "select", options: iconSizes },
    mode: {
      control: "select",
      options: iconModes,
    },
  },
} satisfies Meta<typeof AnimatedIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Spinner: Story = {
  args: {
    animationData: spinnerAnimatedIcon,
    speed: 1,
    isActive: true,
    loop: true,
    size: "xl",
    mode: "accent",
  },
};
