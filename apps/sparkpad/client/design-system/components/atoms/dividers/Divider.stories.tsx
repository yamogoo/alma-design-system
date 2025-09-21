import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { enumOptions } from "@/stories/utils";

import {
  dividerVariants,
  dividerModes,
  dividerSizes,
  dividerTones,
} from "@/adapters";

// import { StoryGrid, InfoBlock, PageHeader } from "@/stories/components";
import { Divider } from "@/components/atoms";
import { UIElementAlignments, UIElementOrientations } from "@/typings";

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

// export const Orientations: Story = {
//   args: {},
// };
