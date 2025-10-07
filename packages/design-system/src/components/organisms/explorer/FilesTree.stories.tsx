import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { http, HttpResponse } from "msw";

import type { TreeViewSelectedItemIndexes } from "@/components/molecules/explorer/tree-view/TreeView";
import type { TreeViewNode } from "@/components/molecules/explorer/tree-view/TreeViewItem";
import type { FilesTreeProps } from "./FilesTree";
import FilesTree from "./FilesTree.vue";

const API_URL = "/api/tree";

const mockDB: Record<string, TreeViewNode[]> = {
  root: [
    { id: 1, name: "Design", isLeaf: false },
    { id: 2, name: "Docs", isLeaf: false },
    { id: 3, name: "README.md", isLeaf: true },
  ],
  "1": [
    { id: 11, name: "Logo.ai", isLeaf: true },
    { id: 12, name: "Export", isLeaf: false },
  ],
  "12": [{ id: 121, name: "logo@2x.png", isLeaf: true }],
  "2": [
    { id: 21, name: "API.md", isLeaf: true },
    { id: 22, name: "ADR", isLeaf: false },
  ],
  "22": [{ id: 221, name: "0001-record.md", isLeaf: true }],
};

const treeHandler = http.get(/.+\/api\/tree\/?$/, ({ request }) => {
  const url = new URL(request.url);
  const parentId = url.searchParams.get("parentId");
  const key = parentId ?? "root";
  const items = mockDB[key] ?? [];
  console.log("[MSW]", request.method, request.url);
  return HttpResponse.json(items, { status: 200 });
});

const meta = {
  title: "Organisms/Explorer/FilesTree",
  component: FilesTree,
  tags: ["autodocs"],
  parameters: {
    msw: { handlers: [treeHandler] },
    docs: {
      description: {
        component: `
**FilesTree** is a smart container around \`TreeView\` that fetches data and lazy-loads children on expand.

- **Fetching:** performs \`GET {apiUrl}\` and \`GET {apiUrl}?parentId=<id>\`. Default response shape is \`{ items: TreeViewNode[] }\`; customize via \`mapResponse(raw) => TreeViewNode[]\`.
- **Lazy loading:** on first expand of a group, calls the API and shows a loading state.
- **Selection / v-model:** two-way bind via \`v-model\` to \`selectedItemIndexes\` (\`ID[] | null\`). Supports single/multi select (\`isMultiSelect\`) and optional checkboxes (\`isCheckable\`).
- **Auto expand:** \`expandDepth\` expands the tree to a given depth after the root loads.
- **Events:** \`update:selected-item-indexes\`, \`loaded(parentId, nodes)\`, \`error(error)\`, \`toggle:item(node, nextExpanded)\`, \`select:item(node)\`.
- **Network options:** pass \`headers\` for auth/tracing, etc.

> For custom API shapes, return \`TreeViewNode[]\` from \`mapResponse\`. Children should be assigned to \`node.children\`.
      `.trim(),
        story: `
This story demonstrates:
- initial root fetch and lazy expansion of branches,
- auto-expansion via \`expandDepth\`,
- single/multi selection with \`v-model\` on \`selectedItemIndexes\`,
- loading and error handling (great with MSW mocks),
- a custom \`mapResponse\` to adapt different API payloads.

In the demo the data is mocked; in production, set \`apiUrl\`, \`headers\`, and \`mapResponse\` as needed.
      `.trim(),
      },
    },
  },
  argTypes: {
    apiUrl: {
      control: "text",
      type: "string",
    },
    expandDepth: {
      control: "number",
      type: "number",
    },
  },
  args: {
    variant: "default",
    size: "md",
    mode: "neutral",
    tone: "primary",
    apiUrl: API_URL,
    rootId: null,
    expandDepth: 0,
    isMultiSelect: false,
    isCheckable: false,
  },
} satisfies Meta<typeof FilesTree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
  parameters: {
    msw: { handlers: [treeHandler] },
  },
  render: (args: FilesTreeProps) => ({
    setup() {
      const selectedItemIndexes = ref<TreeViewSelectedItemIndexes>(["2"]);

      return () => (
        <>
          <FilesTree
            {...args}
            selectedItemIndexes={selectedItemIndexes.value}
          ></FilesTree>
        </>
      );
    },
  }),
};
