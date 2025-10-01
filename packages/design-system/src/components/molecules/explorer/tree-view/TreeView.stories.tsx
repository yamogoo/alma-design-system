import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { enumOptions } from "@/stories/utils";

import {
  treeViewModes,
  treeViewSizes,
  treeViewTones,
  treeViewVariants,
} from "@/adapters";

import {
  TreeView,
  type TreeViewNodes,
  type TreeViewProps,
} from "@/components/molecules";

const meta = {
  title: "Molecules/Explorer/TreeView",
  component: TreeView,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**TreeView** is a presentational, *controlled* tree widget.

- **No fetching:** it doesn't load data by itself; expansion/selection are controlled by the parent.
- **Accessibility:** uses \`tree\` / \`treeitem\` roles; keyboard support for ↑/↓/←/→ and Enter/Space (Home/End optional).
- **Selection:** single or multi; optional checkboxes.
- **Events:** \`update:selected-item-indexes\` (selection change), \`toggle:item\` (expand/collapse), \`node-click\`.
- **Styling:** \`variant\`, \`size\`, \`mode\`, \`tone\`.

> Need fetching and lazy loading? Use **FilesTree**, a smart wrapper around \`TreeView\`.
      `.trim(),
        story: `
This story demonstrates:
- switching between single and multi selection,
- controlled expand/collapse,
- optional checkbox selection,
- focus management and keyboard navigation,
- custom item slot (icon + label).

Data is mocked for the demo. In production, wire it up via **FilesTree** or your own container that fetches and maps nodes.
      `.trim(),
      },
    },
  },
  argTypes: {
    variant: enumOptions(treeViewVariants),
    size: enumOptions(treeViewSizes),
    mode: enumOptions(treeViewModes),
    tone: enumOptions(treeViewTones),
    selectedItemIndexes: {
      description:
        "Controlled selection. When `isMultiSelect` is false, pass a single ID or null; when true, pass an array of IDs.",
      control: "object",
      table: {
        type: { summary: "ID[] | ID | null" },
        defaultValue: { summary: "null" },
        category: "State",
      },
    },
    expandedItemIndexes: {
      description:
        "Controlled expansion. Pass `null` to let the component manage expansion internally (uncontrolled).",
      control: "object",
      table: {
        type: { summary: "ID[] | null" },
        defaultValue: { summary: "null" },
        category: "State",
      },
    },
    loadingItemIndexes: {
      description:
        "IDs currently in a loading state (e.g., while lazy-loading children).",
      control: "object",
      table: {
        type: { summary: "ID[]" },
        defaultValue: { summary: "[]" },
        category: "State",
      },
    },
    isMultiSelect: {
      description: "Enable multi-selection behavior.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "Behavior",
      },
    },
    isCheckable: {
      description: "Show checkboxes for selection.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "UI",
      },
    },
    ariaLabel: {
      description: "Accessible label for the tree container.",
      control: "text",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: '"Files"' },
        category: "A11y",
      },
    },
  },
  args: {
    variant: "default",
    size: "md",
    mode: "neutral",
    tone: "primary",
    ariaLabel: "Tree",
    isCheckable: false,
    isMultiSelect: false,
    isSelectOnRelease: false,
  },
} satisfies Meta<typeof TreeView>;

export default meta;
type Story = StoryObj<typeof meta>;

const nodes: TreeViewNodes = [
  {
    id: "1",
    name: "empty group",
    isLeaf: false,
  },
  {
    id: "2",
    name: "work group",
    isLeaf: false,
    children: [
      {
        id: "4",
        name: "helloWorld.tsx",
        isLeaf: true,
      },
    ],
  },
  {
    id: "3",
    name: "empty group",
    isLeaf: false,
  },
];

export const Playground: Story = {
  args: {
    nodes,
    selectedItemIndexes: null,
    expandedItemIndexes: null,
    loadingItemIndexes: null,
  },
  render: (args: TreeViewProps) => ({
    setup() {
      const selectedItemIndexes = ref(null);

      return () => (
        <>
          <TreeView
            {...args}
            nodes={nodes}
            v-model={selectedItemIndexes}
          ></TreeView>
        </>
      );
    },
  }),
};
