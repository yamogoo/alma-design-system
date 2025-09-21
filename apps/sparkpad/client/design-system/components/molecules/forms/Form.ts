import type { FormMode, FormSize } from "@/adapters";

import type { UIElementUnionProps } from "@/typings";

export interface FormProps extends UIElementUnionProps {
  title?: string;
  mode?: FormMode;
  size?: FormSize;
}
