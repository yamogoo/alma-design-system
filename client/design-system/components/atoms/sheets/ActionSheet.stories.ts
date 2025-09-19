import type { Meta, StoryObj } from "@storybook/vue3-vite";

import ActionSheet from "./ActionSheet.vue";
import { actionSheetModes, actionSheetSizes } from "@/adapters";

const meta = {
  title: "Atoms/sheets/ActionSheet",
  component: ActionSheet,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: actionSheetSizes },
    mode: {
      control: "select",
      options: actionSheetModes,
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
    mode: "primary",
    isActive: true,
  },
};

export const Secondary: Story = {
  args: {
    containerId: "#app",
    size: "lg",
    mode: "secondary",
    isActive: true,
  },
};

export const Accent: Story = {
  args: {
    containerId: "#app",
    size: "lg",
    mode: "accent",
    isActive: true,
  },
};
