import type { SheetColor } from "@/adapters";

import type { UIElementUnionProps } from "@/typings";

export interface SheetProps extends Partial<UIElementUnionProps> {
  color?: SheetColor;
  isOpen: boolean;
  isDialog?: boolean;
}
