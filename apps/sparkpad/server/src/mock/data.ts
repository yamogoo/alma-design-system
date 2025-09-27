export type TreeViewNodeType = "group" | "file";

export type TreeViewNodeID = string | number;

export interface TreeViewNode {
  id: TreeViewNodeID;
  name: string;
  type?: TreeViewNodeType;
  isLeaf?: boolean;
  hasChildren?: boolean;
  children?: TreeViewNode[] | null;
  [key: string]: unknown;
}

export const mockDB: Array<TreeViewNode> = [
  {
    id: 1,
    name: "Design",
    isLeaf: false,
    children: [
      { id: 5, name: "Logo.ai", isLeaf: true },
      {
        id: 6,
        name: "Export",
        isLeaf: false,
        children: [{ id: 7, name: "Logo2.ai", isLeaf: true }],
      },
    ],
  },
  {
    id: 2,
    name: "Docs",
    isLeaf: false,
    children: [{ id: 12, name: "logo@2x.png", isLeaf: true }],
  },
  { id: 3, name: "README.md", isLeaf: true },
  { id: 4, name: "MANIFEST.md", isLeaf: true },
  { id: 13, name: "vite.config.ts", isLeaf: true },
  { id: 14, name: "tsconfig.json", isLeaf: true },
];
