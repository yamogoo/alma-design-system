import { ref } from "vue";
import { defineStore } from "pinia";

export const useConnectionStore = defineStore("connection-store", () => {
  const isConnected = ref(false);
  const setIsConnected = (isEnabled: boolean): boolean => {
    return (isConnected.value = isEnabled);
  };

  return {
    isConnected,
    setIsConnected,
  };
});
