import type {
  SkeletonMode,
  SkeletonSize,
  SkeletonTone,
  SkeletonVariant,
} from "@/adapters";

export interface SkeletonProps {
  variant?: SkeletonVariant;
  size?: SkeletonSize;
  mode?: SkeletonMode;
  tone?: SkeletonTone;
  speed?: number;
  ariaLabel?: string;
  ariaBusy?: boolean;
}
