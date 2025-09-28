import { onMounted, onBeforeUnmount, type Ref } from "vue";

export const useClickOutside = <T extends EventTarget | null>(
  el: Ref<T>,
  cb: (...args: unknown[]) => void
) => {
  if (!el) return;

  const listener = (e: Event): void => {
    // ignore clicks that are on the element or inside its composed path
    if (
      e.target === el.value ||
      (el.value && e.composedPath().includes(el.value))
    )
      return;
    if (typeof cb === "function") cb();
  };

  onMounted(() => {
    window.addEventListener("pointerdown", listener);
    window.addEventListener("click", listener);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("pointerdown", listener);
    window.removeEventListener("click", listener);
  });

  return { listener };
};
