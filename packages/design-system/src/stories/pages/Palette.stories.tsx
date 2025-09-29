import type { Meta, StoryObj } from "@storybook/vue3";

import abstractColors from "@/tokens/output/colors.json";

import {
  StoryGrid,
  InfoBlock,
  ColorBlock,
  PageHeader,
  type ColorBlockProps,
} from "@/stories/components";

const meta = {
  title: "Abstracts/Palette",
  component: ColorBlock,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The abstract color palette defines the foundational color system for the design language.  
Colors are grouped into named families (e.g. \`primary\`, \`neutral\`, \`success\`, \`warning\`).  
Each family is expressed as a continuous tonal scale, with lightness values ranging from **0** (darkest) to **1000** (lightest), in increments of **25**.  

**Naming convention:**  
\`<colorName>-<lightness>\`  
Examples: \`primary-500\`, \`neutral-1000\`, \`success-200\`.  

This palette serves as the base layer for semantic tokens and component color mappings.
`,
      },
    },
  },
  argTypes: {},
} satisfies Meta<typeof ColorBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {
    colorValue: "#000000",
  },
  render: (args: ColorBlockProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Color properties:"}
            description={"color / lightness"}
          ></PageHeader>
          <StoryGrid columns={5}>
            {Object.entries(abstractColors).map(([name, color], key) => {
              return (
                <InfoBlock
                  key={String(key)}
                  align={"center"}
                  orientation={"vertical"}
                >
                  <ColorBlock
                    {...args}
                    name={String(name)}
                    colorValue={String(color)}
                  ></ColorBlock>
                </InfoBlock>
              );
            })}
          </StoryGrid>
        </>
      );
    },
  }),
};
