import { ref, onMounted, onUnmounted, type Ref } from "vue";

export function usePressed(elRef: Ref<HTMLElement | null>, scale = 0.95) {
  const isPressed = ref(false);

  const onDown = (e: PointerEvent) => {
    isPressed.value = true;
    e.stopPropagation();
  };
  const onUp = (e: PointerEvent) => {
    isPressed.value = false;
    e.stopPropagation();
  };

  onMounted(() => {
    const el = elRef.value;
    if (!el) return;
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onUp);
  });

  onUnmounted(() => {
    const el = elRef.value;
    if (!el) return;
    el.removeEventListener("pointerdown", onDown);
    el.removeEventListener("pointerup", onUp);
    el.removeEventListener("pointerleave", onUp);
  });

  return { isPressed, scale };
}
