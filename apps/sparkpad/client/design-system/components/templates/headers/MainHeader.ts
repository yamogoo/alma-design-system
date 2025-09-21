import type {
  MainHeaderMode,
  MainHeaderSize,
  MainHeaderTone,
  MainHeaderVariant,
} from "@/adapters";

import type { UIElementHeaderTag } from "@/typings";

export interface MainHeaderProps {
  as?: UIElementHeaderTag;
  variant?: MainHeaderVariant;
  size?: MainHeaderSize;
  tone?: MainHeaderTone;
  mode?: MainHeaderMode;
  isMainElement?: boolean;
}
