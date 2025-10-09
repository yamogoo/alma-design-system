import { ref, toValue, watch, type Ref } from "vue";
import type { RouteMeta } from "@/typings";

import { getPathSegment } from "@/utils/getPathSegment";

import { useRouteHistory } from "@/composables/local/router/useRouteHistory";

import type { TransitionType } from "@/typings";

export interface UsePageTransition {
  onBeforeRouterLeave: () => void;
}

export const usePageTransition = (opts: UsePageTransition) => {
  const { onBeforeRouterLeave } = opts;
  const { prevMeta, currentMeta, nextMeta, prevRoute, currentRoute } =
    useRouteHistory();

  const transitionInType: Ref<TransitionType> = ref("fade");
  const transitionOutType: Ref<TransitionType> = ref("fade");

  /**
   * Transition direction
   */
  const resolveTransition = (
    prev: RouteMeta,
    current: RouteMeta,
    prevPath: string,
    currentPath: string
  ): { in: TransitionType; out: TransitionType } => {
    const prevRID = prev.rid ?? 0;
    const currentRID = current.rid ?? 0;

    const transitionType: "horizontal" | "vertical" =
      prev.transitionType === "vertical" ||
      current.transitionType === "vertical"
        ? "vertical"
        : "horizontal";

    const prevRoot = getPathSegment(prevPath, 3);
    const currentRoot = getPathSegment(currentPath, 3);

    const isSectionChange = prevRoot !== currentRoot;

    const isForward = prevRID < currentRID;
    const isBackward = prevRID > currentRID;

    // Custom transitionIn/out priority from meta
    if (current.transitionIn && current.transitionOut) {
      return {
        in: current.transitionIn,
        out: current.transitionOut,
      };
    }

    // Section change (different path root segments)
    if (isSectionChange) {
      const inType =
        transitionType === "vertical"
          ? isForward
            ? "top-to-bottom"
            : "bottom-to-top"
          : isForward
            ? "right-to-left"
            : "left-to-right";

      const outType =
        transitionType === "vertical"
          ? isForward
            ? "top-to-bottom"
            : "bottom-to-top"
          : isForward
            ? "right-to-left"
            : "left-to-right";

      return { in: inType, out: outType };
    }

    // Inside section
    if (isForward || isBackward) {
      const inType =
        transitionType === "vertical"
          ? isForward
            ? "top-to-bottom"
            : "bottom-to-top"
          : "fade";

      const outType =
        transitionType === "vertical"
          ? isForward
            ? "top-to-bottom"
            : "bottom-to-top"
          : "fade";

      return { in: inType, out: outType };
    }

    // Neutral transition (eg get rid did not change)
    return { in: "fade", out: "fade" };
  };

  watch(
    [prevMeta, currentMeta, nextMeta],
    () => {
      const prev = toValue(prevMeta) as unknown as RouteMeta;
      const current = toValue(currentMeta) as unknown as RouteMeta;
      const prevRouteValue = toValue(prevRoute);
      const currentRouteValue = toValue(currentRoute);

      const prevPath = prevRouteValue?.fullPath || "";
      const currentPath = currentRouteValue?.fullPath || "";

      const { in: inType, out: outType } = resolveTransition(
        prev,
        current,
        prevPath,
        currentPath
      );

      transitionInType.value = inType;
      transitionOutType.value = outType;

      onBeforeRouterLeave();
    },
    { immediate: true }
  );

  return {
    transitionInType,
    transitionOutType,
  };
};
