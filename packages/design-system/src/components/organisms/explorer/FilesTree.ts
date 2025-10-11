import { NAMESPACE } from "@/constants";

import type {
  TreeViewNode,
  TreeViewNodeID,
} from "@/components/molecules/explorer/tree-view/TreeViewItem";

import type {
  TreeViewConfigProps,
  TreeViewControlProps,
  TreeViewStylingProps,
} from "@/components/molecules/explorer/tree-view/TreeView";

export interface FilesTreeMessages {
  apiLoadingMessage: string;
  apiErrorMessage: string;
}

export interface FilesTreeProps
  extends TreeViewConfigProps,
    Partial<
      Pick<TreeViewControlProps, "selectedItemIndexes" | "expandedItemIndexes">
    >,
    Partial<TreeViewStylingProps>,
    Partial<FilesTreeMessages> {
  apiUrl: string;
  rootId?: TreeViewNodeID | null;
  expandDepth?: number;
  headers?: Record<string, string>;
  mapResponse?: (raw: unknown) => TreeViewNode[];
}

export const SHEET_PREFIX = `${NAMESPACE}filsed-tree`;
