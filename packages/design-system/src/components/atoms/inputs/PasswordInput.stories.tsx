import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { booleanOptions, enumOptions } from "@/stories";

import { inputModes, inputSizes, inputTones, inputVariants } from "@/adapters";

import { StoryGrid, InfoBlock, PageHeader } from "@/stories/components";
import { PasswordInput, type PasswordInputProps } from "@/components/atoms";

const meta = {
  title: "Atoms/Inputs/PasswordInput",
  component: PasswordInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "PasswordInput extends the base Input component with password-specific features, including masking/unmasking of input text. It supports all base Input modifiers (variant, size, mode, tone) and adds additional controls like `masked` and `isMaskIconShown` for secure text entry.",
      },
    },
  },
  argTypes: {
    variant: enumOptions(inputVariants),
    size: enumOptions(inputSizes),
    mode: enumOptions(inputModes),
    tone: enumOptions(inputTones),
    value: {
      type: "string",
      defaultValue: "",
    },
    placeholder: {
      type: "string",
      defaultValue: "placeholder",
    },
    errorMessage: {
      type: "string",
      defaultValue: "error",
    },
    masked: booleanOptions(true),
    isFocused: booleanOptions(false),
    isDisabled: booleanOptions(false),
    isError: booleanOptions(false),
    isRestButtonEnabled: booleanOptions(false),
    isMaskIconShown: booleanOptions(false),
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: "lg",
    mode: "neutral",
    tone: "primary",
    value: "",
    placeholder: "login",
  },
};

export const Colors: Story = {
  args: {
    value: "",
    placeholder: "placeholder",
    mode: "neutral",
    tone: "primary",
    size: "md",
  },
  render: (args: PasswordInputProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Input sizes"}
            description={
              "Demonstrates all available input sizes across modes and tones."
            }
          ></PageHeader>
          <StoryGrid columns={2}>
            {inputModes.map((mode) =>
              inputTones.map((tone) => {
                const title = `${mode} / ${tone}`;
                return (
                  <InfoBlock
                    key={`${mode}-${tone}`}
                    title={title}
                    align={"center"}
                    orientation={"vertical"}
                  >
                    <PasswordInput
                      {...args}
                      variant={"default"}
                      mode={mode}
                      tone={tone}
                      size={"lg"}
                      value={""}
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

export const Sizes: Story = {
  args: {
    value: "",
    placeholder: "placeholder",
    mode: "neutral",
    // tone: "primary",
    size: "md",
  },
  render: (args: PasswordInputProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Input colors"}
            description={
              "Shows how variant and size combinations appear under neutral mode and primary tone."
            }
          ></PageHeader>
          <StoryGrid columns={2}>
            {inputVariants.map((variant) =>
              inputSizes.map((size) => {
                const title = `${variant} / ${size}`;
                return (
                  <InfoBlock
                    key={`${variant}-${size}`}
                    title={title}
                    align={"center"}
                    orientation={"vertical"}
                  >
                    <PasswordInput
                      {...args}
                      variant={variant}
                      mode={"neutral"}
                      tone={"primary"}
                      size={size}
                      value={""}
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
