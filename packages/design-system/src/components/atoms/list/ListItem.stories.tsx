import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { enumOptions } from "@/stories/utils";

import {
  listItemModes,
  listItemSizes,
  listItemTones,
  listItemVariants,
} from "@/adapters";

import StoryGrid from "@/stories/components/atoms/grids/StoryGrid.vue";
import PageHeader from "@/stories/components/atoms/headers/PageHeader.vue";
import StoryBox from "@/stories/components/atoms/blocks/StoryBox.vue";

import { ListItem, type ListItemProps } from ".";
import Slider from "@/components/atoms/controls/slider/Slider.vue";
import Switch from "@/components/atoms/controls/toggles/switch/Switch.vue";

const meta = {
  title: "Atoms/List/Listitem",
  component: ListItem,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A fundamental atomic list element responsible for the visual and interactive representation of a row. Supports states, selection, click behavior, radio mode, and custom content.",
        story:
          "Demonstrates various use cases of ListItem — single item, multiple selection, radio group, and nested states within List.",
      },
    },
  },
  argTypes: {
    as: { control: "text" },
    variant: enumOptions(listItemVariants),
    size: enumOptions(listItemSizes),
    mode: enumOptions(listItemModes),
    tone: enumOptions(listItemTones),
    isClickable: {
      control: "boolean",
    },
    isDisabled: {
      control: "boolean",
    },
  },
  args: {
    id: "1",
    as: "div",
    variant: "list",
    size: "md",
    mode: "neutral",
    tone: "primary",
    title: "Interactive List Component",
    description:
      "Verifying hover, press, and selection feedback in a token-driven design system.",
    value: undefined,
    isJoined: false,
    isClickable: false,
    isDisabled: false,
    isActive: false,
    isFocused: false,
    isSelectOnRelease: true,
    iconName: "cog",
    iconStyle: "outline",
    iconWeight: "400",
    bordered: true,
  },
} satisfies Meta<typeof ListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    as: "div",
    title: "Interactive List Component",
    description:
      "Verifying hover, press, and selection feedback in a token-driven design system.",
    value: "four",
    isClickable: true,
  },
  render: (args: ListItemProps) => ({
    setup() {
      return () => (
        <StoryGrid columns={1}>
          <StoryBox width="100%">
            <ListItem {...args}></ListItem>
          </StoryBox>
        </StoryGrid>
      );
    },
  }),
};

export const Colors: Story = {
  args: {
    as: "div",
    title: "Interactive List Component",
    description:
      "Verifying hover, press, and selection feedback in a token-driven design system.",
    isClickable: true,
  },
  render: (args: ListItemProps) => ({
    setup() {
      return () => (
        <StoryGrid columns={2}>
          {listItemModes.map((mode) =>
            listItemTones.map((tone) => (
              <StoryBox width="100%">
                <ListItem {...args} mode={mode} tone={tone}></ListItem>
              </StoryBox>
            ))
          )}
        </StoryGrid>
      );
    },
  }),
};

export const Controls: Story = {
  args: {
    as: "div",
    title: "Interactive List Component",
    description:
      "Verifying hover, press, and selection feedback in a token-driven design system.",
    isClickable: true,
  },
  render: (args: ListItemProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"ListItem colors"}
            description={"Shows mode and tone."}
          ></PageHeader>
          <StoryGrid columns={2}>
            <StoryBox width="100%">
              <ListItem
                {...args}
                v-slots={{
                  append: () => <Switch isActive={false}></Switch>,
                }}
              ></ListItem>
            </StoryBox>
            <StoryBox width="100%">
              <ListItem
                {...args}
                v-slots={{
                  append: () => (
                    <Slider
                      value={100}
                      max={100}
                      style={{ width: "240px" }}
                    ></Slider>
                  ),
                }}
              ></ListItem>
            </StoryBox>
          </StoryGrid>
        </>
      );
    },
  }),
};
