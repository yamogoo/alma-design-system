import type { TreeViewSelectedItemIndexes } from "./TreeView";

export type TreeViewNodeType = "group" | "file";

export type TreeViewNodeId = string | number | symbol;

export interface TreeViewNode {
  id: TreeViewNodeId;
  name: string;
  type?: TreeViewNodeType;
  isLeaf?: boolean;
  hasChildren?: boolean;
  children?: TreeViewNode[] | null;
  [key: string]: unknown;
}

export interface TreeViewItemProps {
  node: TreeViewNode;
  depth: number;
  selectedItemIndexes: TreeViewSelectedItemIndexes;
  expandedItemIndexes: TreeViewSelectedItemIndexes;
  loadingItemIndexes: TreeViewSelectedItemIndexes;
  isCheckable?: boolean;
  isSelectOnRelease?: boolean;
}
