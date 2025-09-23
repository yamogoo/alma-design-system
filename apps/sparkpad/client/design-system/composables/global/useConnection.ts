import { onMounted, onUnmounted } from "vue";

import { useConnectionStore } from "@/stores";

export const useConnection = () => {
  const { setIsConnected } = useConnectionStore();

  const updateConnectionStatus = () => {
    if (navigator.onLine) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  };

  const onOnlineStatus = (): void => {
    updateConnectionStatus();
  };

  const addEventListeners = (): void => {
    window.addEventListener("online", onOnlineStatus);
    window.addEventListener("offline", onOnlineStatus);
  };

  const removeEventListeners = (): void => {
    window.removeEventListener("online", onOnlineStatus);
    window.removeEventListener("offline", onOnlineStatus);
  };

  onMounted(() => {
    updateConnectionStatus();
    addEventListeners();
  });

  onUnmounted(() => {
    removeEventListeners();
  });
};
