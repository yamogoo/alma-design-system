import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { fn } from "storybook/test";

import { enumOptions } from "@/stories/utils";

import {
  buttonModes,
  buttonSizes,
  buttonTones,
  buttonVariants,
} from "@/adapters";

import { StoryGrid, InfoBlock, PageHeader } from "@/stories/components";
import {
  Button,
  type ButtonProps,
  iconNames,
  iconStyles,
  iconWeights,
} from "@/components/atoms";

const meta = {
  title: "Atoms/Buttons/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Button is the core interactive element of the design system. It serves as the foundation for specialized buttons like ControlButton (circular control actions) and ActionButton (emphasized primary actions). The base button provides consistent behavior, accessibility, and styling, and includes key modifiers such as variant, tone, mode, and size, along with flexible icon placement options.",
      },
    },
  },
  argTypes: {
    size: enumOptions(buttonSizes),
    mode: enumOptions(buttonModes),
    tone: enumOptions(buttonTones),
    variant: enumOptions(buttonVariants),
    contentDirection: enumOptions(["ltr", "rtl"]),
    prependIconName: enumOptions(iconNames),
    prependIconStyle: enumOptions(iconStyles),
    prependIconWeight: enumOptions(iconWeights),
    appendIconName: enumOptions(iconNames),
    appendIconStyle: enumOptions(iconStyles),
    appendIconWeight: enumOptions(iconWeights),
    scalePressed: {
      control: "number",
    },
    stretch: {
      control: "select",
      options: ["fill", "auto"],
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
              "Shows how mode and tone combinations affect the button’s appearance for each variant."
            }
          ></PageHeader>
          <StoryGrid columns={4}>
            {buttonVariants.map((variant) =>
              buttonModes.map((mode) =>
                buttonTones.map((tone) => {
                  const title = `${variant} / ${tone} / ${mode}`;
                  const label = variant === "default" ? `Button` : undefined;
                  return (
                    <InfoBlock
                      key={`${variant}-${mode}-${tone}`}
                      title={title}
                      align={"center"}
                      orientation={"vertical"}
                    >
                      <Button
                        {...args}
                        variant={variant}
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
              )
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
