import { ref, computed, type Ref, type ComputedRef } from "vue";
import type { RouteLocationNormalized, RouteMeta } from "vue-router";

type MaybeRoute = RouteLocationNormalized | null;

export interface RouteHistory {
  prevMeta: ComputedRef<RouteMeta>;
  currentMeta: ComputedRef<RouteMeta>;
  nextMeta: ComputedRef<RouteMeta>;

  prevRoute: ComputedRef<MaybeRoute>;
  currentRoute: ComputedRef<MaybeRoute>;
  nextRoute: ComputedRef<MaybeRoute>;

  _internals: {
    prevRoute: Ref<MaybeRoute>;
    currentRoute: Ref<MaybeRoute>;
    nextRoute: Ref<MaybeRoute>;
  };
}

const prevRoute: Ref<MaybeRoute> = ref(null);
const currentRoute: Ref<MaybeRoute> = ref(null);
const nextRoute: Ref<MaybeRoute> = ref(null);

export const useRouteHistory = (): RouteHistory => {
  const prevMeta = computed<RouteMeta>(
    () => prevRoute.value?.meta ?? ({} as RouteMeta)
  );
  const currentMeta = computed<RouteMeta>(
    () => currentRoute.value?.meta ?? ({} as RouteMeta)
  );
  const nextMeta = computed<RouteMeta>(
    () => nextRoute.value?.meta ?? ({} as RouteMeta)
  );

  const prev = computed<MaybeRoute>(() => prevRoute.value);
  const current = computed<MaybeRoute>(() => currentRoute.value);
  const next = computed<MaybeRoute>(() => nextRoute.value);

  return {
    prevMeta,
    currentMeta,
    nextMeta,
    prevRoute: prev,
    currentRoute: current,
    nextRoute: next,
    _internals: { prevRoute, currentRoute, nextRoute },
  };
};

export const trackRouteHistory = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
): void => {
  prevRoute.value = from;
  currentRoute.value = to;
  nextRoute.value = to;
};
