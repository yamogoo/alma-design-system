import type {
  TreeViewMode,
  TreeViewSize,
  TreeViewTone,
  TreeViewVariant,
} from "@/adapters";

import type { TreeViewNodeID, TreeViewNode } from "./TreeViewItem";

export type TreeViewNodes = Array<TreeViewNode>;

export type TreeViewSelectedItemIndexes = Array<TreeViewNodeID> | null;

export interface TreeViewStylingProps {
  variant: TreeViewVariant;
  size: TreeViewSize;
  mode: TreeViewMode;
  tone: TreeViewTone;
  nodes: TreeViewNodes;
}

export interface TreeViewConfigProps {
  isMultiSelect?: boolean;
  isCheckable?: boolean;
  isSelectOnRelease?: boolean;
  isExpandOnItemPress?: boolean;
}

export interface TreeViewControlProps {
  //** multiple selection of item selected indexes */
  selectedItemIndexes: TreeViewSelectedItemIndexes;
  expandedItemIndexes: TreeViewSelectedItemIndexes;
  loadingItemIndexes: TreeViewSelectedItemIndexes;
}

export interface TreeViewProps
  extends TreeViewStylingProps,
    TreeViewConfigProps,
    Partial<TreeViewControlProps> {
  ariaLabel?: string;
}
