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

import {
  iconNames,
  iconStyles,
  iconWeights,
  ControlButton,
  type ButtonProps,
} from "@/components/atoms";

const meta = {
  title: "Atoms/Buttons/ControlButton",
  component: ControlButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "ControlButton is a derivative of the base Button component, styled as a circular action button for compact controls. It is typically used for secondary or contextual actions, such as opening menus, toggling options, or controlling media playback. It supports different sizes, tones, and icon variations to match the overall UI theme.",
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
} satisfies Meta<typeof ControlButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: "md",
    mode: "neutral",
    tone: "primary",
    iconName: "check",
    iconStyle: "outline",
    iconWeight: "400",
  },
};

export const Variants: Story = {
  args: {
    mode: "neutral",
    tone: "primary",
    iconName: "check",
    iconStyle: "outline",
    iconWeight: "400",
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
                  const variant: ButtonVariant = "rounded";
                  const title = `${variant} / ${tone} / ${mode} / ${size}`;

                  return (
                    <InfoBlock
                      key={`${variant}-${size}-${mode}-${tone}`}
                      title={title}
                      align={"center"}
                      orientation={"vertical"}
                    >
                      <ControlButton
                        {...args}
                        variant={variant}
                        mode={mode}
                        tone={tone}
                        size={size}
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
