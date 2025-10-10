import { NAMESPACE } from "@/constants";

import type { TreeViewControlProps } from "./TreeView";

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

export interface TreeViewItemProps extends TreeViewControlProps {
  node: TreeViewNode;
  depth: number;
  isCheckable?: boolean;
  isSelectOnRelease?: boolean;
  isIconShown?: boolean;
}

export const TREE_VIEW_ITEM_PREFIX = `${NAMESPACE}tree-view-item`;
