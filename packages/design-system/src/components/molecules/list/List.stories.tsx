import type { Meta, StoryObj } from "@storybook/vue3";

import {
  listModes,
  listSizes,
  listTone,
  listVariants,
} from "@/adapters/molecules/list";

import { enumOptions } from "@/stories/utils";

import { UIElementMaybeListOrBlockTags } from "@/typings";

import StoryGrid from "@/stories/components/atoms/grids/StoryGrid.vue";

import type { ListItems } from "./List";
import List from "./List.vue";

import ListItem from "./ListItem.vue";
import Group from "../../atoms/containers/Group.vue";

const meta = {
  title: "Molecules/List/List",
  component: List,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "",
        story: "",
      },
    },
  },
  argTypes: {
    as: enumOptions(UIElementMaybeListOrBlockTags),
    variant: enumOptions(listVariants),
    size: enumOptions(listSizes),
    mode: enumOptions(listModes),
    tone: enumOptions(listTone),
    items: { control: "object" },
  },
  args: {
    as: "div",
    items: [],
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS: ListItems = ["First", "Second", "Third", "Fourth", "Fifth"];

export const Playground: Story = {
  args: {},
  render: () => ({
    setup() {
      return () => (
        <StoryGrid columns={1}>
          <List isMultiple={false}>
            {ITEMS.map((item) => (
              <Group variant={"block"} size={"md"}>
                <ListItem id={item} title={item} isJoined={false}></ListItem>
              </Group>
            ))}
          </List>
        </StoryGrid>
      );
    },
  }),
};

export const Joined: Story = {
  args: {},
  render: () => ({
    setup() {
      return () => (
        <StoryGrid columns={1}>
          <List isMultiple={false}>
            {ITEMS.map((item) => (
              <ListItem id={item} title={item}></ListItem>
            ))}
          </List>
        </StoryGrid>
      );
    },
  }),
};

export const MultipleSelection: Story = {
  args: {},
  render: () => ({
    setup() {
      return () => (
        <StoryGrid columns={1}>
          <List isMultiple={true}>
            {ITEMS.map((item) => (
              <ListItem id={item} title={item}></ListItem>
            ))}
          </List>
        </StoryGrid>
      );
    },
  }),
};
