import { Constants } from "@/constants";

export type OverlayId =
  (typeof Constants.OVERLAY_IDS)[keyof typeof Constants.OVERLAY_IDS];
