import { onMounted, onUnmounted, toValue, type MaybeRefOrGetter } from "vue";

export const useElementFollowCursor = (
  parent: MaybeRefOrGetter<HTMLElement | null>,
  child: MaybeRefOrGetter<HTMLElement | null>
) => {
  function updatePosition(e: MouseEvent) {
    const parentEl = toValue(parent);
    const childEl = toValue(child);

    if (!parentEl || !childEl) return;

    const parentRect = parentEl.getBoundingClientRect();
    const childRect = childEl.getBoundingClientRect();

    const x = e.clientX - parentRect.left;
    const y = e.clientY - parentRect.top;

    const clampedX = Math.min(
      Math.max(0, x - childRect.width / 2),
      parentRect.width - childRect.width
    );
    const clampedY = Math.min(
      Math.max(0, y - childRect.height / 2),
      parentRect.height - childRect.height
    );

    console.log(clampedX, clampedY);

    childEl.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
  }

  onMounted(() => {
    toValue(parent)?.addEventListener("mousemove", updatePosition);
  });

  onUnmounted(() => {
    toValue(parent)?.removeEventListener("mousemove", updatePosition);
  });
};
