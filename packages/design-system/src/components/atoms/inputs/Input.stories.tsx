import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { booleanOptions, enumOptions } from "@/stories";

import {
  inputModes,
  inputSizes,
  inputTones,
  inputVariants,
} from "@/adapters/atoms/input";

import StoryGrid from "@/stories/components/atoms/grids/StoryGrid.vue";
import PageHeader from "@/stories/components/atoms/headers/PageHeader.vue";
import InfoBlock from "@/stories/components/atoms/blocks/InfoBlock.vue";

import { type InputProps } from "@/components/atoms/inputs/Input";
import Input from "@/components/atoms/inputs/Input.vue";

const meta = {
  title: "Atoms/Inputs/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Input is the base text field component of the design system. It supports key modifiers such as variant, size, mode, and tone, and includes properties for placeholder, value, error messages, and state flags like disabled or error. Serves as the foundation for specialized inputs like PasswordInput.",
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
    isFocused: booleanOptions(false),
    isDisabled: booleanOptions(false),
    isError: booleanOptions(false),
    isRestButtonEnabled: booleanOptions(false),
  },
} satisfies Meta<typeof Input>;

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
  render: (args: InputProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Input colors"}
            description={"Shows mode and tone."}
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
                    <Input
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
  render: (args: InputProps) => ({
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
                    <Input
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
