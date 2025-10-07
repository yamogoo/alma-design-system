import type {
  TreeViewMode,
  TreeViewSize,
  TreeViewTone,
  TreeViewVariant,
} from "@/adapters/molecules/treeView";

import type {
  TreeViewNodeID,
  TreeViewNode,
  TreeViewItemProps,
} from "./TreeViewItem";

export type TreeViewNodes = Array<TreeViewNode>;

export type TreeViewSelectedItemIndexes =
  | Array<TreeViewNodeID>
  | TreeViewNodeID
  | null;

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
    Partial<TreeViewControlProps>,
    Partial<Pick<TreeViewItemProps, "isIconShown">> {
  ariaLabel?: string;
}
