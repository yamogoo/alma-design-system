import type { Meta, StoryObj } from "@storybook/vue3";

import { booleanOptions, enumOptions } from "@/stories/utils";

import {
  groupModes,
  groupSizes,
  groupTones,
  groupVariants,
} from "@/adapters/atoms/group";

import {
  UIElementAlignments,
  UIElementBlockTags,
  UIElementDirections,
  UIElementOrientations,
  UIElementStretches,
} from "@/typings";

import StoryGrid from "@/stories/components/atoms/grids/StoryGrid.vue";
import PageHeader from "@/stories/components/atoms/headers/PageHeader.vue";
import InfoBlock from "@/stories/components/atoms/blocks/InfoBlock.vue";

import type { GroupProps } from "./Group";
import Group from "./Group.vue";
import Button from "@/components/atoms/buttons/Button.vue";

const meta = {
  title: "Atoms/Containers/Group",
  component: Group,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Groups are the primary positioning containers that organize and align multiple components within a layout.",
        story:
          "Interactive playground to explore orientation, size, and color tokens.",
      },
    },
  },
  argTypes: {
    as: enumOptions(UIElementBlockTags),
    variant: enumOptions(groupVariants),
    size: enumOptions(groupSizes),
    mode: enumOptions(groupModes),
    tone: enumOptions(groupTones),
    orientation: enumOptions(UIElementOrientations),
    direction: enumOptions(UIElementDirections),
    verticalAlignment: enumOptions(UIElementAlignments),
    horizontalAlignment: enumOptions(UIElementAlignments),
    stretch: enumOptions(UIElementStretches),
    wrap: booleanOptions(false),
    divider: booleanOptions(false),
    gapX: {
      control: "text",
      table: { category: "Layout" },
      description: "Horizontal gap (e.g. 8px, 0.5rem, var(--space-sm))",
    },
    gapY: {
      control: "text",
      table: { category: "Layout" },
      description: "Vertical gap",
    },
  },
  args: {
    size: "md",
    mode: "neutral",
    tone: "ghost",
    role: "group",
    ariaLabel: "Example group",
  },
} satisfies Meta<typeof Group>;

export default meta;
type Story = StoryObj<typeof meta>;

const BUTTONS = Array.from({ length: 10 }, (_, i) => `Button ${i + 1}`);

export const Playground: Story = {
  args: {
    orientation: "horizontal",
  },
  render: (args: GroupProps) => ({
    setup() {
      return () => (
        <>
          <StoryGrid columns={1}>
            <Group {...args}>
              {BUTTONS.slice(0, 3).map((label) => (
                <Button
                  key={label}
                  size={"md"}
                  mode={"neutral"}
                  tone={"primary"}
                  label={label}
                ></Button>
              ))}
            </Group>
          </StoryGrid>
        </>
      );
    },
  }),
};

export const Orientation: Story = {
  args: {
    variant: "block",
  },
  render: (args: GroupProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title="Group orientations"
            description="Demonstrates orientations of the group"
          ></PageHeader>
          <StoryGrid columns={1}>
            {UIElementOrientations.map((orientation) => (
              <InfoBlock
                key={orientation}
                title={orientation}
                align={"center"}
                orientation={"vertical"}
              >
                <Group {...args} orientation={orientation}>
                  {BUTTONS.slice(0, 3).map((label) => (
                    <Button
                      key={label}
                      size={"md"}
                      mode={"neutral"}
                      tone={"primary"}
                      label={label}
                    ></Button>
                  ))}
                </Group>
              </InfoBlock>
            ))}
          </StoryGrid>
        </>
      );
    },
  }),
};

export const Size: Story = {
  args: {
    mode: "neutral",
    tone: "secondary",
    stretch: "auto",
  },
  render: (args: GroupProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Group size"}
            description={"Demonstrates variant and size"}
          ></PageHeader>
          <StoryGrid columns={1}>
            {groupVariants.map((variant) =>
              groupSizes.map((size) => (
                <InfoBlock
                  key={`${variant}${size}`}
                  title={`${variant} / ${size}`}
                  align={"center"}
                  orientation={"vertical"}
                >
                  <Group {...args} variant={variant} size={size}>
                    {BUTTONS.slice(0, 3).map((label) => (
                      <Button
                        key={label}
                        size={size}
                        mode={"neutral"}
                        tone={"secondary"}
                        label={label}
                      ></Button>
                    ))}
                  </Group>
                </InfoBlock>
              ))
            )}
          </StoryGrid>
        </>
      );
    },
  }),
};

export const Color: Story = {
  args: {
    variant: "block",
    tone: "primary",
  },
  render: (args: GroupProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Group colors"}
            description={"Demonstrates mode and tone"}
          ></PageHeader>
          <StoryGrid columns={1}>
            {groupModes.map((mode) =>
              groupTones.map((tone) => (
                <InfoBlock
                  key={`${mode}${tone}`}
                  title={`${mode} / ${tone}`}
                  align={"center"}
                  orientation={"vertical"}
                >
                  <Group {...args} mode={mode} tone={tone}>
                    {BUTTONS.slice(0, 3).map((label) => (
                      <Button
                        key={label}
                        size={"md"}
                        mode={"neutral"}
                        tone={"primary"}
                        label={label}
                      ></Button>
                    ))}
                  </Group>
                </InfoBlock>
              ))
            )}
          </StoryGrid>
        </>
      );
    },
  }),
};

export const Stretch: Story = {
  args: {
    orientation: "vertical",
  },
  render: (args: GroupProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Group stretch"}
            description={"Demonstrates stretchness of the group"}
          ></PageHeader>
          <StoryGrid columns={1}>
            {UIElementStretches.map((stretch) => (
              <InfoBlock
                key={stretch}
                title={stretch}
                align={"center"}
                orientation={"vertical"}
              >
                <Group {...args} stretch={stretch}>
                  {BUTTONS.slice(0, 3).map((label) => (
                    <Button
                      key={label}
                      size={"md"}
                      mode={"neutral"}
                      tone={"primary"}
                      label={label}
                    ></Button>
                  ))}
                </Group>
              </InfoBlock>
            ))}
          </StoryGrid>
        </>
      );
    },
  }),
};
