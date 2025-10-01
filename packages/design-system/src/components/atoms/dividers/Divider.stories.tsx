import type { Meta, StoryObj } from "@storybook/vue3";

import { enumOptions } from "@/stories/utils";

import {
  dividerVariants,
  dividerModes,
  dividerSizes,
  dividerTones,
} from "@/adapters/atoms/divider";

import { UIElementAlignments, UIElementOrientations } from "@/typings";

import Divider from "./Divider.vue";

const meta = {
  title: "Atoms/Dividers/Divider",
  component: Divider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "...",
      },
    },
  },
  argTypes: {
    variant: enumOptions(dividerVariants),
    size: enumOptions(dividerSizes),
    mode: enumOptions(dividerModes),
    tone: enumOptions(dividerTones),
    orientation: enumOptions(UIElementOrientations),
    align: enumOptions(UIElementAlignments),
  },
  args: {
    variant: "default",
    size: "md",
    mode: "neutral",
    tone: "primary",
    orientation: "horizontal",
    align: "center",
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
};
