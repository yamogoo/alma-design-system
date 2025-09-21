import type { OVERLAY_IDS } from "@/constants";

export type OverlayId = (typeof OVERLAY_IDS)[keyof typeof OVERLAY_IDS];
