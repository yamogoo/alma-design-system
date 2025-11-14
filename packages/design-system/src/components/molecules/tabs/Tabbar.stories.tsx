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

import type { TabbarItems } from "./Tabbar";
import Tabbar from "./Tabbar.vue";

const meta = {
  title: "Molecules/Tabbar/Tabbar",
  component: Tabbar,
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
} satisfies Meta<typeof Tabbar>;

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS: TabbarItems = [
  {
    id: String(crypto.randomUUID()),
    label: "First",
  },
  {
    id: String(crypto.randomUUID()),
    label: "Second",
  },
  {
    id: String(crypto.randomUUID()),
    label: "Third",
  },
];
const ITEMS_2: TabbarItems = [
  {
    id: String(crypto.randomUUID()),
    label: "First",
  },
  {
    id: String(crypto.randomUUID()),
    label: "Second",
  },
  {
    id: String(crypto.randomUUID()),
    label: "Third",
  },
];

export const Playground: Story = {
  args: {},
  render: () => ({
    setup() {
      return () => (
        <StoryGrid columns={1}>
          <Tabbar items={ITEMS}></Tabbar>
          <Tabbar items={ITEMS_2}></Tabbar>
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
          <Tabbar items={ITEMS}></Tabbar>
        </StoryGrid>
      );
    },
  }),
};
