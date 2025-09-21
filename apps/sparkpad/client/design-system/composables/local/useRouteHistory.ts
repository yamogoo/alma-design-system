import { ref, computed, type ComputedRef } from "vue";
import type { RouteLocationNormalized } from "vue-router";

const prevRoute = ref<RouteLocationNormalized | null>(null);
const currentRoute = ref<RouteLocationNormalized | null>(null);
const nextRoute = ref<RouteLocationNormalized | null>(null);

export const useRouteHistory = () => {
  const prevMeta = computed(() => prevRoute.value?.meta ?? {});
  const currentMeta = computed(() => currentRoute.value?.meta ?? {});
  const nextMeta = computed(() => nextRoute.value?.meta ?? {});

  const prev: ComputedRef<RouteLocationNormalized | null> = computed(
    () => prevRoute.value
  );
  const current: ComputedRef<RouteLocationNormalized | null> = computed(
    () => currentRoute.value
  );
  const next: ComputedRef<RouteLocationNormalized | null> = computed(
    () => nextRoute.value
  );

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
