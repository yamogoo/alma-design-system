import type { Meta, StoryObj } from "@storybook/vue3";

import { fn } from "storybook/test";

import { enumOptions } from "@/stories/utils";

import {
  buttonModes,
  buttonSizes,
  buttonTones,
  type ButtonVariant,
} from "@/adapters/atoms/button";

import StoryGrid from "@/stories/components/atoms/grids/StoryGrid.vue";
import PageHeader from "@/stories/components/atoms/headers/PageHeader.vue";
import InfoBlock from "@/stories/components/atoms/blocks/InfoBlock.vue";

import {
  iconNames,
  iconStyles,
  iconWeights,
} from "@/components/atoms/icons/Icon";

import type { ButtonProps } from "@/components/atoms/buttons/Button";
import ControlButton from "@/components/atoms/buttons/ControlButton.vue";

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
