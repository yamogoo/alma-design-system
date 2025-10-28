import { NAMESPACE } from "@/constants";

import type { SurfaceMode, SurfaceTone } from "@/adapters/atoms/surface";

import type {
  UIElementBlockTag,
  UIElementBorderProps,
  UIElementElevatedProps,
  UIElementStretch,
} from "@/typings";
import {
  UIElementShortPositionAliases,
  UIElementShortPositions,
} from "@/typings";
import type { StackContainerProps, StackFacetVariantsProps } from "./Stack";

export const SurfaceBorderPositions = UIElementShortPositions;
export const SurfaceBorderPositionAliases = UIElementShortPositionAliases;
export type SurfaceStretch = UIElementStretch;

export type LikeStackProps = StackContainerProps;

export type SurfaceFacetVariantsProps = Pick<
  StackFacetVariantsProps,
  "variant" | "size"
>;

export type SurfaceFacetThemingProps = {
  mode: SurfaceMode;
  tone: SurfaceTone;
};

export type SurfaceFacetProps = SurfaceFacetThemingProps &
  SurfaceFacetVariantsProps;

export interface SurfaceProps
  extends Partial<SurfaceFacetProps>,
    LikeStackProps,
    UIElementElevatedProps,
    UIElementBorderProps {
  as?: UIElementBlockTag;
  isContainer?: boolean;
}

export const SURFACE_PREFIX = `${NAMESPACE}surface`;
