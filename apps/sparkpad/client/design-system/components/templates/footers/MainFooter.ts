import type {
  MainFooterMode,
  MainFooterSize,
  MainFooterTone,
  MainFooterVariant,
} from "@/adapters";

import type { UIElementFooterTag } from "@/typings";

export interface MainFooterProps {
  as?: UIElementFooterTag;
  variant?: MainFooterVariant;
  size?: MainFooterSize;
  tone?: MainFooterTone;
  mode?: MainFooterMode;
}
