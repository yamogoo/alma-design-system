import type {
  TreeViewNode,
  TreeViewNodeID,
  TreeViewConfigProps,
  TreeViewControlProps,
  TreeViewStylingProps,
} from "@/components/molecules";

export interface FilesTreeProps
  extends TreeViewConfigProps,
    Partial<
      Pick<TreeViewControlProps, "selectedItemIndexes" | "expandedItemIndexes">
    >,
    Partial<TreeViewStylingProps> {
  apiUrl: string;
  rootId?: TreeViewNodeID | null;
  expandDepth?: number;
  headers?: Record<string, string>;
  mapResponse?: (raw: unknown) => TreeViewNode[];
}
