import { NAMESPACE } from "@/constants";

import type {
  StepPaginationTabMode,
  StepPaginationTabSize,
  StepPaginationTabTone,
  StepPaginationTabVariant,
} from "@/adapters/atoms/stepPaginationTabs";

import type { UIElementStylingModifiers } from "@/typings";

export interface StepPaginationTabItem {
  id: number;
  label: string;
}

export interface StepPaginationTabsProps
  extends Partial<
    UIElementStylingModifiers<
      StepPaginationTabVariant,
      StepPaginationTabSize,
      StepPaginationTabMode,
      StepPaginationTabTone
    >
  > {
  items: StepPaginationTabItem[];
  selectedItemIndex?: number;
  size?: StepPaginationTabSize;
  mode?: StepPaginationTabMode;
}

export const STEP_PAGINATIO_TABS_PREFIX = `${NAMESPACE}step-pagination-tabs`;
