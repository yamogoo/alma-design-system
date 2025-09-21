import { onBeforeUnmount, onMounted, type Ref } from "vue";

import type { UIElementOrientation } from "~/design-system/typings";

interface UseMenuNavigationOptions {
  root: Ref<HTMLElement | null>;
  orientation?: UIElementOrientation;
}

export const useMenuNavigation = ({
  root,
  orientation = "horizontal",
}: UseMenuNavigationOptions) => {
  const getItems = (): HTMLElement[] => {
    if (!root.value) return [];
    return Array.from(
      root.value.querySelectorAll<HTMLElement>("[role='menuitem']")
    ).filter((el) => !el.hasAttribute("disabled"));
  };

  const focusItem = (index: number) => {
    const items = getItems();
    if (items.length > 0) items[(index + items.length) % items.length]?.focus();
  };

  const focusNext = () => {
    const items = getItems();
    const currentIndex = items.findIndex((el) => el === document.activeElement);
    focusItem(currentIndex + 1);
  };

  const focusPrev = () => {
    const items = getItems();
    const currentIndex = items.findIndex((el) => el === document.activeElement);
    focusItem(currentIndex - 1);
  };

  const focusFirst = () => {
    const items = getItems();
    if (items.length > 0) items[0].focus();
  };

  const focusLast = () => {
    const items = getItems();
    if (items.length > 0) items[items.length - 1].focus();
  };

  const onKeydown = (e: KeyboardEvent) => {
    if (!root.value) return;

    if (orientation === "horizontal") {
      if (e.key === "ArrowRight") {
        focusNext();
        e.preventDefault();
      }
      if (e.key === "ArrowLeft") {
        focusPrev();
        e.preventDefault();
      }
    } else {
      if (e.key === "ArrowDown") {
        focusNext();
        e.preventDefault();
      }
      if (e.key === "ArrowUp") {
        focusPrev();
        e.preventDefault();
      }
    }

    if (e.key === "Home") {
      focusFirst();
      e.preventDefault();
    }
    if (e.key === "End") {
      focusLast();
      e.preventDefault();
    }

    if (e.key === "Enter" || e.key === " ") {
      const active = document.activeElement as HTMLElement;
      active?.click();
      e.preventDefault();
    }
  };

  onMounted(() => {
    root.value?.addEventListener("keydown", onKeydown);
  });

  onBeforeUnmount(() => {
    root.value?.removeEventListener("keydown", onKeydown);
  });

  return {
    focusNext,
    focusPrev,
    focusFirst,
    focusLast,
  };
};
