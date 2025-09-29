import type { Meta, StoryObj } from "@storybook/vue3";

import { enumOptions } from "@/stories/utils";

import { textModes, textTones, textVariants } from "@/adapters";

import { StoryGrid, InfoBlock, PageHeader } from "@/stories/components";
import { Text, type TextProps } from "@/components/atoms";

const meta = {
  title: "Atoms/Typography/Text",
  component: Text,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The Text component is a basic building block for displaying textual content in the interface. It provides consistent typography and styling across the design system.",
      },
    },
  },
  argTypes: {
    variant: enumOptions(textVariants),
    mode: enumOptions(textModes),
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: "label-1",
    mode: "neutral",
    tone: "primary",
    value: "Text",
  },
};

export const Sizes: Story = {
  args: {
    variant: "label-1",
    mode: "neutral",
    tone: "primary",
    value: "Text",
  },
  render: (args: TextProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader title={"Text sizes:"}></PageHeader>
          <StoryGrid columns={1}>
            {textVariants.map((variant) => {
              const key = `${variant}`;

              return (
                <InfoBlock key={key} align={"center"} orientation={"vertical"}>
                  <Text
                    {...args}
                    variant={variant}
                    mode={"neutral"}
                    tone={"primary"}
                    value={variant}
                  ></Text>
                </InfoBlock>
              );
            })}
          </StoryGrid>
        </>
      );
    },
  }),
};

export const Variants: Story = {
  args: {
    variant: "label-1",
    mode: "neutral",
    tone: "primary",
    value: "Text",
  },
  render: (args: TextProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Text modifiers:"}
            description={"variant / mode / tone"}
          ></PageHeader>
          <StoryGrid columns={5}>
            {textVariants.map((variant) =>
              textModes.map((mode) =>
                textTones.map((tone) => {
                  const title = `${variant} / ${mode} / ${tone}`;
                  const key = `${variant}-${mode}-${tone}`;

                  return (
                    <InfoBlock
                      key={key}
                      title={title}
                      align={"center"}
                      orientation={"vertical"}
                    >
                      <Text
                        {...args}
                        variant={variant}
                        mode={mode}
                        tone={tone}
                        value={variant}
                      ></Text>
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
