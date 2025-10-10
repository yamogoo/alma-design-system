import { NAME_SPACE } from "@/constants";

import type {
  IconSize,
  IconMode,
  IconTone,
  IconVariant,
} from "@/adapters/atoms/icon";

import { iconNames, iconStyles, iconWeights } from "alma-icons";

import type { UIElementStylingModifiers } from "@/typings";

export type IconName = (typeof iconNames)[number];
export type IconStyle = (typeof iconStyles)[number];
export type IconWeight = (typeof iconWeights)[number];

export interface IconStyleProps {
  name: IconName;
  appearance: IconStyle;
  weight: IconWeight;
}

export interface IconComponentProps {
  iconName: IconName;
  iconStyle: IconStyle;
  iconWeight: IconWeight;
  iconSize: IconSize;
}

export interface IconProps
  extends Partial<
      UIElementStylingModifiers<IconVariant, IconSize, IconMode, IconTone>
    >,
    IconStyleProps {}

export * from "alma-icons";

export const ICON_PREFIX = `${NAME_SPACE}icon`;
