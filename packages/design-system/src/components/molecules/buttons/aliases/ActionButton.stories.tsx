import type { Meta, StoryObj } from "@storybook/vue3-vite";

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

import type { ActionButtonProps } from "./ActionButton";
import ActionButton from "./ActionButton.vue";

const meta = {
  title: "Atoms/Buttons/Aliases/ActionButton",
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
    mode: "neutral",
    tone: "primary",
    iconName: "check",
    iconStyle: "outline",
    iconWeight: "400",
  },
};

export const Variants: Story = {
  args: {
    label: "Button",
    mode: "neutral",
    tone: "primary",
    size: "md",
  },
  render: (args: ActionButtonProps) => ({
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
