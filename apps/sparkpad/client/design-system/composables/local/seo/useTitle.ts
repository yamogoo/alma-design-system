import { ref, watch } from "vue";

export function useTitle(initial: string) {
  const title = ref(initial);

  const setTitle = (t: string) => {
    title.value = t;
    if (typeof document !== "undefined") {
      document.title = t;
    }
  };

  watch(
    title,
    (t) => {
      if (typeof document !== "undefined") {
        document.title = t;
      }
    },
    { immediate: true }
  );

  return { title, setTitle };
}
