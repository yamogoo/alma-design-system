import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { actionSheetSizes } from "@/adapters/molecules/actionSheet";
import { surfaceModes } from "@/adapters/atoms/surface";

import ActionSheet from "./ActionSheet.vue";

const meta = {
  title: "Atoms/Sheets/ActionSheet",
  component: ActionSheet,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: actionSheetSizes },
    mode: {
      control: "select",
      options: surfaceModes,
    },
    isActive: {
      control: "boolean",
      defaultValue: "false",
    },
  },
  decorators: () => [],
} satisfies Meta<typeof ActionSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    containerId: "#app",
    size: "lg",
    mode: "neutral",
    tone: "primary",
    isActive: true,
  },
};

export const Secondary: Story = {
  args: {
    containerId: "#app",
    size: "lg",
    mode: "neutral",
    tone: "secondary",
    isActive: true,
  },
};
