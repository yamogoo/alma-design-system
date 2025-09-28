import type { StepPaginationTabMode, StepPaginationTabSize } from "@/adapters";

import type { UIElementUnionProps } from "@/typings";

export interface StepPaginationTabItem {
  id: number;
  label: string;
}

export interface StepPaginationTabsProps extends Partial<UIElementUnionProps> {
  items: StepPaginationTabItem[];
  selectedItemId?: number;
  size?: StepPaginationTabSize;
  mode?: StepPaginationTabMode;
}
