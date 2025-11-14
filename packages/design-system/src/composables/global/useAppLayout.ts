import { onMounted, onUnmounted } from "vue";

import { useLayoutStore } from "@/stores";

export const useAppLayout = (selector: string) => {
  const { setAppSize } = useLayoutStore();

  const onResize = () => {
    const el = document.querySelector(selector);

    if (!el) return;

    const { width, height } = el.getBoundingClientRect();

    setAppSize({ width, height });
  };

  const addEventListeners = (): void => {
    window.addEventListener("resize", onResize);
  };

  const removeEventListeners = (): void => {
    window.removeEventListener("resize", onResize);
  };

  onMounted(() => {
    onResize();
    addEventListeners();
  });

  onUnmounted(() => {
    removeEventListeners();
  });
};
