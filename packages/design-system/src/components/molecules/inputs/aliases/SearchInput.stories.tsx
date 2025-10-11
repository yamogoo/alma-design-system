import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { booleanOptions, enumOptions } from "@/stories";

import {
  inputModes,
  inputSizes,
  inputTones,
  inputVariants,
} from "@/adapters/atoms/input";

import PageHeader from "@/stories/components/atoms/headers/PageHeader.vue";
import StoryGrid from "@/stories/components/atoms/grids/StoryGrid.vue";
import InfoBlock from "@/stories/components/atoms/blocks/InfoBlock.vue";

import { type SearchFieldProps } from "./SearchInput";
import SearchInput from "./SearchInput.vue";

const meta = {
  title: "Atoms/Inputs/Aliases/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `**SearchField** is a controlled search input that wraps the atomic \`Input\` and forwards styling modifiers (**variant**, **size**, **mode**, **tone**) while managing focus state.
**Key points**
- Predictable two-way data flow via \`value\` / \`update:value\`.
- Emits \`update:focused\` on focus/blur and \`reset:value\` when cleared.
- Optional search icon is decorative (\`aria-hidden="true"\`) for accessible UI.
- Supports optional auto-clear on unmount to prevent stale state.
- Aligned with design-token-driven theming and BEM-style class naming.
`,
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
      defaultValue: "search",
    },
    isDisabled: booleanOptions(false),
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: "lg",
    mode: "neutral",
    tone: "primary",
    value: "",
    placeholder: "Search",
  },
};

export const Colors: Story = {
  args: {
    value: "",
    placeholder: "search",
    mode: "neutral",
    tone: "primary",
    size: "md",
  },
  render: (args: SearchFieldProps) => ({
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
                    <SearchInput
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
    placeholder: "Search",
    mode: "neutral",
    size: "md",
  },
  render: (args: SearchFieldProps) => ({
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
                    <SearchInput
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
