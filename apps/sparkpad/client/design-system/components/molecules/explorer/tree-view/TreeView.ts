import type {
  TreeViewMode,
  TreeViewSize,
  TreeViewTone,
  TreeViewVariant,
} from "@/adapters";

import type { TreeViewNodeId, TreeViewNode } from "./TreeViewItem";

export type TreeViewNodes = Array<TreeViewNode>;

export type TreeViewSelectedItemIndexes = Array<TreeViewNodeId> | null;

export interface TreeViewProps {
  variant: TreeViewVariant;
  size: TreeViewSize;
  mode: TreeViewMode;
  tone: TreeViewTone;
  nodes: TreeViewNodes;
  //** multiple selection of item selected indexes */
  selectedItemIndexes?: TreeViewSelectedItemIndexes;
  expandedItemIndexes: TreeViewSelectedItemIndexes;
  loadingItemIndexes: TreeViewSelectedItemIndexes;
  isMultiSelect?: boolean;
  isCheckable?: boolean;
  isSelectOnRelease?: boolean;
  isExpandOnItemPress?: true;
  ariaLabel?: string;
}
