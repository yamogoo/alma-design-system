import type { IconSize, IconMode, IconTone } from "@/adapters";

import { iconNames, iconStyles, iconWeights } from "alma-icons";

import type { UIElementVariant } from "@/typings";

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
}

export interface IconProps extends IconStyleProps {
  variant?: UIElementVariant;
  size?: IconSize;
  mode?: IconMode;
  tone?: IconTone;
}

export * from "alma-icons";
