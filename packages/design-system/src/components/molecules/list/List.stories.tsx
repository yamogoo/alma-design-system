import type { Meta, StoryObj } from "@storybook/vue3-vite";

import {
  listModes,
  listSizes,
  listTones,
  listVariants,
} from "@/adapters/molecules/list";

import { enumOptions } from "@/stories/utils";

import { UIElementMaybeListOrBlockTags } from "@/typings";

import StoryGrid from "@/stories/components/atoms/grids/StoryGrid.vue";

import type { ListItems } from "./List";
import List from "./List.vue";

import ListItem from "@/components/atoms/list/ListItem.vue";
import Slider from "@/components/atoms/controls/slider/Slider.vue";
import Switch from "@/components/atoms/controls/toggles/switch/Switch.vue";

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
    tone: enumOptions(listTones),
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
const ITEMS_2: ListItems = [
  {
    id: String(crypto.randomUUID()),
    title: "First",
    description: "Some description",
  },
  {
    id: String(crypto.randomUUID()),
    title: "Second",
    description: "Some description",
  },
  {
    id: String(crypto.randomUUID()),
    title: "Third",
    description: "Some description",
  },
];

export const Playground: Story = {
  args: {},
  render: () => ({
    setup() {
      return () => (
        <StoryGrid columns={1}>
          <List
            isSelectable={false}
            isMultiple={false}
            isJoined={false}
            items={ITEMS}
          ></List>
          <List
            isSelectable={false}
            isMultiple={false}
            isJoined={true}
            items={ITEMS_2}
          ></List>
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
          <List isMultiple={false} isClickable={true}>
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
            {ITEMS_2.map(({ id, title, description }) => (
              <ListItem
                id={id}
                title={title}
                description={description}
              ></ListItem>
            ))}
          </List>
        </StoryGrid>
      );
    },
  }),
};

export const Controls: Story = {
  args: {},
  render: () => ({
    setup() {
      return () => (
        <StoryGrid columns={1}>
          <List isMultiple={false} isSelectable={false}>
            <ListItem
              id={ITEMS_2[0].id}
              title={ITEMS_2[0].title}
              v-slots={{
                append: () => <Switch isActive={false}></Switch>,
              }}
            ></ListItem>
            <ListItem
              id={ITEMS_2[1].id}
              title={ITEMS_2[1].title}
              v-slots={{
                append: () => <Switch isActive={false}></Switch>,
              }}
            ></ListItem>
            <ListItem
              id={ITEMS_2[0].id}
              title={ITEMS_2[0].title}
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
          </List>
        </StoryGrid>
      );
    },
  }),
};
