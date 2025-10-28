import { computed, ref, type Ref } from "vue";
import { defineStore } from "pinia";

import type { ISize } from "@/typings";
import breakpoints from "@/tokens/src/breakpoints.json";

export const useLayoutStore = defineStore("layout-store", () => {
  const appSize: Ref<ISize> = ref({
    width: 0,
    height: 0,
  });

  const setAppSize = (size: ISize): void => {
    appSize.value = size;
  };

  const layoutType = computed(() => {
    if (appSize.value.width < breakpoints.md.$value) return "mobile";
    return "desktop";
  });

  const isDesktopLayout = computed(() => {
    return appSize.value.width >= breakpoints.lg.$value;
  });

  const isTabletLayout = computed(() => {
    return (
      appSize.value.width >= breakpoints.md.$value &&
      appSize.value.width < breakpoints.lg.$value
    );
  });

  const isMobileLayout = computed(() => {
    return appSize.value.width < breakpoints.md.$value;
  });

  return {
    breakpoints,
    appSize,
    setAppSize,
    layoutType,
    isDesktopLayout,
    isTabletLayout,
    isMobileLayout,
  };
});
