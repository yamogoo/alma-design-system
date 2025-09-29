import type { Meta, StoryObj } from "@storybook/vue3";

import { booleanOptions, enumOptions } from "@/stories/utils";

import { StoryGrid, InfoBlock, PageHeader } from "@/stories/components";

import {
  switchModes,
  switchSizes,
  switchTones,
  switchVariants,
} from "@/adapters";

import type { SwitchProps } from "./Switch";
import Switch from "./Switch.vue";

const meta = {
  title: "Atoms/Controls/Toggles/Switch/Switch",
  tags: ["autodocs"],
  component: Switch,
  parameters: {
    docs: {
      description: {
        component:
          "Switch is an atomic toggle component. It supports both native and custom modes, keyboard interaction, active/disabled states, and animated knob transitions. Typically used for binary choices (on/off).",
        story:
          "Examples of using the Switch with different sizes, themes, and display variants.",
      },
    },
  },
  argTypes: {
    variant: enumOptions(switchVariants),
    size: enumOptions(switchSizes),
    mode: enumOptions(switchModes),
    tone: enumOptions(switchTones),
    isActive: booleanOptions(false),
    isDisabled: booleanOptions(false),
    label: {
      type: "string",
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground for experimenting with props such as isActive, and isDisabled state.",
      },
    },
  },
};

export const Size: Story = {
  args: {
    variant: "default",
    size: "md",
    mode: "neutral",
    tone: "primary",
    isActive: false,
  },
  render: (args: SwitchProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title="Switch sizes"
            description="Demonstrates how different size tokens and variants affect the appearance and spacing of the switch."
          ></PageHeader>
          <StoryGrid columns={2}>
            {switchVariants.map((variant) =>
              switchSizes.map((size) => (
                <InfoBlock
                  key={`${variant}${size}`}
                  title={`${variant} / ${size}`}
                  align={"center"}
                  orientation={"vertical"}
                >
                  <Switch {...args} variant={variant} size={size}></Switch>
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
    mode: "neutral",
    tone: "primary",
    isActive: false,
  },
  render: (args: SwitchProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title="Switch colors"
            description="Shows the effect of mode and tone combinations on the switch track, knob, and label."
          ></PageHeader>
          <StoryGrid columns={2}>
            {switchModes.map((mode) =>
              switchTones.map((tone) => (
                <InfoBlock
                  key={`${mode}${tone}`}
                  title={`${mode} / ${tone}`}
                  align={"center"}
                  orientation={"vertical"}
                >
                  <Switch {...args} mode={mode} tone={tone}></Switch>
                </InfoBlock>
              ))
            )}
          </StoryGrid>
        </>
      );
    },
  }),
};
