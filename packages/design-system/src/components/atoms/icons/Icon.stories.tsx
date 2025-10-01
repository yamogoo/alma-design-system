import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { enumOptions } from "@/stories/utils";

import { iconModes, iconSizes, iconTones, iconVariants } from "@/adapters";

import { StoryGrid, InfoBlock, PageHeader } from "@/stories/components";
import {
  Icon,
  iconNames,
  iconStyles,
  iconWeights,
  type IconProps,
} from "@/components/atoms";

const meta = {
  title: "Atoms/Icons/Icon",
  component: Icon,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The base Icon component provides access to the AlmaIcons library, which includes 450+ symbols, supporting 2 styles (fill and outline) and 5 stable weights (100–500). 
It serves as a flexible building block for embedding consistent, scalable vector icons across the design system.

**Props overview:**
- \`name\`: selects an icon from the AlmaIcons set.  
- \`appearance\`: defines style (fill/outline).  
- \`weight\`: controls stroke weight (100–500).  
- \`size\`: scales icon from \`xxs\` to \`xl\`.  
- \`mode\` + \`tone\`: apply color tokens from the system palette.  
- \`variant\`: included as a nominal prop to align with the token structure across components; not functionally used in Icon, but preserved for consistency.
`,
      },
    },
  },
  argTypes: {
    name: enumOptions(iconNames),
    appearance: enumOptions(iconStyles),
    weight: enumOptions(iconWeights),
    size: enumOptions(iconSizes),
    mode: enumOptions(iconModes),
    tone: enumOptions(iconTones),
    variant: enumOptions(iconVariants),
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    mode: "neutral",
    tone: "primary",
    name: "cross",
    appearance: "outline",
    weight: "400",
    size: "xxs",
  },
};

export const Styles: Story = {
  args: {
    mode: "neutral",
    tone: "primary",
    name: "check",
    appearance: "outline",
    weight: "400",
  },
  render: (args: IconProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Icon styles"}
            description={"Fill/outline styles across available weights"}
          ></PageHeader>
          <StoryGrid columns={7}>
            {iconStyles.map((style) =>
              iconWeights.map((weight) => {
                const title = `${style} / ${weight}`;
                const key = `${style}-${weight}`;

                return (
                  <InfoBlock
                    key={key}
                    title={title}
                    align={"center"}
                    orientation={"vertical"}
                  >
                    <Icon
                      {...args}
                      name={"music"}
                      size={"md"}
                      appearance={style}
                      weight={weight}
                    ></Icon>
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
    mode: "neutral",
    tone: "primary",
    name: "check",
    appearance: "outline",
    weight: "400",
  },
  render: (args: IconProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Icon sizes"}
            description={"Scale from xxs to xl"}
          ></PageHeader>
          <StoryGrid columns={1}>
            {iconSizes.map((size) => {
              const title = `${size}`;
              const key = `${size}`;

              return (
                <InfoBlock
                  key={key}
                  title={title}
                  align={"center"}
                  orientation={"vertical"}
                >
                  <Icon
                    {...args}
                    name={"check"}
                    size={size}
                    mode={"neutral"}
                    tone={"primary"}
                  ></Icon>
                </InfoBlock>
              );
            })}
          </StoryGrid>
        </>
      );
    },
  }),
};

export const Colors: Story = {
  args: {
    mode: "neutral",
    tone: "primary",
    name: "check",
    appearance: "outline",
    weight: "400",
  },
  render: (args: IconProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Text modifiers"}
            description={"Mode and tone combinations"}
          ></PageHeader>
          <StoryGrid columns={5}>
            {iconModes.map((mode) =>
              iconTones.map((tone) => {
                const title = `${mode} / ${tone}`;
                const key = `${mode}-${tone}`;

                return (
                  <InfoBlock
                    key={key}
                    title={title}
                    align={"center"}
                    orientation={"vertical"}
                  >
                    <Icon
                      {...args}
                      name={"check"}
                      size={"md"}
                      mode={mode}
                      tone={tone}
                    ></Icon>
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
