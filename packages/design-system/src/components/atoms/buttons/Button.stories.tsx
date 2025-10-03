import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { fn } from "storybook/test";

import { enumOptions } from "@/stories/utils";

import {
  buttonModes,
  buttonSizes,
  buttonTones,
  buttonVariants,
} from "@/adapters/atoms/button";

import StoryGrid from "@/stories/components/atoms/grids/StoryGrid.vue";
import PageHeader from "@/stories/components/atoms/headers/PageHeader.vue";
import InfoBlock from "@/stories/components/atoms/blocks/InfoBlock.vue";

import {
  iconNames,
  iconStyles,
  iconWeights,
} from "@/components/atoms/icons/Icon";

import type { ButtonProps } from "./Button";
import Button from "./Button.vue";

const meta = {
  title: "Atoms/Buttons/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    controls: { sort: "requiredFirst", expanded: true },
    docs: {
      description: {
        component:
          "Button is the core interactive element of the design system. It serves as the foundation for specialized buttons like ControlButton (circular control actions) and ActionButton (emphasized primary actions). The base button provides consistent behavior, accessibility, and styling, and includes key modifiers such as variant, tone, mode, and size, along with flexible icon placement options.",
      },
    },
  },
  argTypes: {
    variant: {
      ...enumOptions(buttonVariants),
      table: { category: "Appearance" },
      description: "Visual style",
    },
    size: {
      ...enumOptions(buttonSizes),
      table: { category: "Sizing" },
      description: "Control size",
    },
    mode: { ...enumOptions(buttonModes), table: { category: "Theme" } },
    tone: { ...enumOptions(buttonTones), table: { category: "Theme" } },
    stretch: {
      control: "select",
      options: ["fill", "auto"],
      table: { category: "Layout" },
    },
    contentDirection: {
      control: "radio",
      options: ["ltr", "rtl"],
      table: { category: "I18n" },
    },
    prependIconName: {
      ...enumOptions(iconNames),
      table: { category: "Icons" },
    },
    prependIconStyle: {
      ...enumOptions(iconStyles),
      table: { category: "Icons" },
    },
    prependIconWeight: {
      ...enumOptions(iconWeights),
      table: { category: "Icons" },
    },
    appendIconName: { ...enumOptions(iconNames), table: { category: "Icons" } },
    appendIconStyle: {
      ...enumOptions(iconStyles),
      table: { category: "Icons" },
    },
    appendIconWeight: {
      ...enumOptions(iconWeights),
      table: { category: "Icons" },
    },
    scalePressed: {
      control: "number",
    },
  },
  args: {
    onPointerdown: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label: "Button",
    size: "md",
    mode: "neutral",
    tone: "primary",
  },
};

export const Sizes: Story = {
  args: {
    label: "Button",
    mode: "neutral",
    tone: "primary",
    size: "md",
  },
  render: (args: ButtonProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Button sizes"}
            description={
              "Demonstrates size tokens from xxs to xl across available variants."
            }
          ></PageHeader>
          <StoryGrid columns={2}>
            {buttonVariants.map((variant) =>
              buttonSizes.map((size) => {
                const title = `${variant} / ${size}`;
                const label = variant === "default" ? `Button` : undefined;
                return (
                  <InfoBlock
                    key={`${variant}-${size}`}
                    title={title}
                    align={"center"}
                    orientation={"vertical"}
                  >
                    <Button
                      {...args}
                      variant={variant}
                      mode={"neutral"}
                      tone={"primary"}
                      size={size}
                      stretch="auto"
                      label={label}
                      prependIconName={"check"}
                      prependIconStyle={"outline"}
                      prependIconWeight={"400"}
                    />
                  </InfoBlock>
                );
              })
            )}
          </StoryGrid>
        </>
      );
    },
  }),
};

export const Colors: Story = {
  args: {
    label: "Button",
    mode: "neutral",
    tone: "primary",
    size: "md",
  },
  render: (args: ButtonProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Button colors"}
            description={
              "Shows how mode and tone combinations affect the button's appearance for each variant."
            }
          ></PageHeader>
          <StoryGrid columns={5}>
            {buttonModes.map((mode) =>
              buttonTones.map((tone) => {
                const title = `${tone} / ${mode}`;
                const label = "Button";
                return (
                  <InfoBlock
                    key={`${mode}-${tone}`}
                    title={title}
                    align={"center"}
                    orientation={"vertical"}
                  >
                    <Button
                      {...args}
                      variant={"default"}
                      mode={mode}
                      tone={tone}
                      size={"md"}
                      stretch="auto"
                      label={label}
                      prependIconName={"check"}
                      prependIconStyle={"outline"}
                      prependIconWeight={"400"}
                    />
                  </InfoBlock>
                );
              })
            )}
          </StoryGrid>
        </>
      );
    },
  }),
};

export const Variants: Story = {
  args: {
    label: "Button",
    mode: "neutral",
    tone: "primary",
    size: "md",
  },
  render: (args: ButtonProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Button variants"}
            description={
              "Demonstrates default variant across modes, tones, and sizes."
            }
          ></PageHeader>
          <StoryGrid columns={4}>
            {buttonSizes.map((size) =>
              buttonModes.map((mode) =>
                buttonTones.map((tone) => {
                  const title = `${tone} / ${mode} / ${size}`;
                  const label = "Button";
                  return (
                    <InfoBlock
                      key={`${size}-${mode}-${tone}`}
                      title={title}
                      align={"center"}
                      orientation={"vertical"}
                    >
                      <Button
                        {...args}
                        variant={"default"}
                        mode={mode}
                        tone={tone}
                        size={size}
                        stretch="auto"
                        label={label}
                        prependIconName={"check"}
                        prependIconStyle={"outline"}
                        prependIconWeight={"400"}
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
