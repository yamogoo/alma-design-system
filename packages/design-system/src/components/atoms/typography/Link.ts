import type { TextProps } from "@/components/atoms/typography/Text";

import type { Route } from "@/typings/routes";

export interface LinkProps extends TextProps {
  to?: Route;
  href?: string;
}
