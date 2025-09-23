import type { Meta, StoryObj } from "@storybook/vue3";

import { booleanOptions, enumOptions } from "@/stories/utils";

import { StoryGrid, InfoBlock, PageHeader } from "@/stories/components";
import { Group, Button, type GroupProps } from "@/components/atoms";
import { groupModes, groupSizes, groupTones, groupVariants } from "@/adapters";
import {
  UIElementAlignments,
  UIElementBlockTags,
  UIElementDirections,
  UIElementOrientations,
  UIElementStretches,
} from "@/typings";

const meta = {
  title: "Atoms/Containers/Group",
  component: Group,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Groups are the primary positioning containers that organize and align multiple components within a layout.",
      },
    },
  },
  argTypes: {
    as: enumOptions(UIElementBlockTags),
    size: enumOptions(groupSizes),
    variant: enumOptions(groupVariants),
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
      type: "string",
    },
    gapY: {
      type: "string",
    },
  },
  args: {
    size: "md",
    mode: "neutral",
    tone: "primary",
  },
} satisfies Meta<typeof Group>;

export default meta;
type Story = StoryObj<typeof meta>;

let buttons = [];

for (let i = 1; i <= 10; i++) {
  buttons.push(`Button ${i}`);
}

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
              {buttons.slice(0, 3).map((label) => (
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
  args: {},
  render: (args: GroupProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Group orientations"}
            description={"Demonstrates orientations of the group"}
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
                  {buttons.slice(0, 3).map((label) => (
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
                    {buttons.slice(0, 3).map((label) => (
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
                    {buttons.slice(0, 3).map((label) => (
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
                  {buttons.slice(0, 3).map((label) => (
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
