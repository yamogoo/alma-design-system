import { computed, ref, type Ref } from "vue";
import { defineStore } from "pinia";

import { Typings, Tokens } from "@alma/design-system";

export const useLayoutStore = defineStore("layout-store", () => {
  const appSize: Ref<Typings.ISize> = ref({
    width: 0,
    height: 0,
  });

  const setAppSize = (size: Typings.ISize): void => {
    appSize.value = size;
  };

  const layoutType = computed(() => {
    if (appSize.value.width < Tokens.breakpoints.md.$value) return "mobile";

    return "desktop";
  });

  const isDesktopLayout = computed(() => {
    return appSize.value.width >= Tokens.breakpoints.lg.$value;
  });

  const isTabletLayout = computed(() => {
    return (
      appSize.value.width >= Tokens.breakpoints.md.$value &&
      appSize.value.width < Tokens.breakpoints.lg.$value
    );
  });

  const isMobileLayout = computed(() => {
    return appSize.value.width < Tokens.breakpoints.md.$value;
  });

  return {
    appSize,
    setAppSize,
    layoutType,
    isDesktopLayout,
    isTabletLayout,
    isMobileLayout,
  };
});
