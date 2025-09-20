import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { fn } from "storybook/test";

import { enumOptions } from "@/stories/utils";

import {
  buttonModes,
  buttonSizes,
  buttonTones,
  type ButtonVariant,
} from "@/adapters";

import { StoryGrid, InfoBlock, PageHeader } from "@/stories/components";

import { iconNames, iconStyles, iconWeights } from "@/components/atoms";

import { ActionButton, type ButtonProps } from "@/components/atoms";

const meta = {
  title: "Atoms/Buttons/ActionButton",
  component: ActionButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "ActionButton is a derivative of the base Button component, designed for primary or secondary actions. It can display a text label, an icon, or a combination of both, and supports all core button sizes, tones, and modes.",
      },
    },
  },
  argTypes: {
    size: enumOptions(buttonSizes),
    mode: enumOptions(buttonModes),
    tone: enumOptions(buttonTones),
    variant: enumOptions(["rounded"]),
    contentDirection: enumOptions(["ltr", "rtl"]),
    iconName: enumOptions(iconNames),
    iconStyle: enumOptions(iconStyles),
    iconWeight: enumOptions(iconWeights),
  },
  args: {
    onPress: fn(),
  },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label: "Button",
    size: "md",
    tone: "neutral",
    mode: "primary",
    iconName: "check",
    iconStyle: "outline",
    iconWeight: "400",
  },
};

export const Variants: Story = {
  args: {
    label: "Button",
    mode: "primary",
    tone: "neutral",
    size: "md",
  },
  render: (args: ButtonProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Button modifiers:"}
            description={"variant /tone / mode / size"}
          ></PageHeader>
          <StoryGrid columns={4}>
            {buttonSizes.map((size) =>
              buttonModes.map((mode) =>
                buttonTones.map((tone) => {
                  const variant: ButtonVariant = "default";
                  const title = `${variant} / ${tone} / ${mode} / ${size}`;

                  return (
                    <InfoBlock
                      key={`${variant}-${size}-${mode}-${tone}`}
                      title={title}
                      align={"center"}
                      orientation={"vertical"}
                    >
                      <ActionButton
                        {...args}
                        variant={variant}
                        mode={mode}
                        tone={tone}
                        size={size}
                        label={"Button"}
                        stretch="auto"
                        iconName={"check"}
                        iconStyle={"outline"}
                        iconWeight={"400"}
                      />
                    </InfoBlock>
                  );
                })
              )
            )}
          </StoryGrid>
        </>
      );
    },
  }),
};
