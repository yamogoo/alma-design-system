import { ref } from "vue";
import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings-store", () => {
  const isOpen = ref(false);
  const setIsOpen = (state: boolean): boolean => {
    return (isOpen.value = state);
  };

  return { isOpen, setIsOpen };
});
