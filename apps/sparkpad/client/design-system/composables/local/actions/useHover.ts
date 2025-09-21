import { ref, onMounted, onUnmounted, type Ref } from "vue";

export function useHover(elRef: Ref<HTMLElement | null>) {
  const isHovered = ref(false);

  const onEnter = () => {
    isHovered.value = true;
  };
  const onLeave = () => {
    isHovered.value = false;
  };

  onMounted(() => {
    const el = elRef.value;
    if (!el) return;
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
  });

  onUnmounted(() => {
    const el = elRef.value;
    if (!el) return;
    el.removeEventListener("pointerenter", onEnter);
    el.removeEventListener("pointerleave", onLeave);
  });

  return { isHovered };
}
