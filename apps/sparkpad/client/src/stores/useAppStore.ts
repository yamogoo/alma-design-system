import { ref } from "vue";
import { defineStore } from "pinia";

import { useTypedLocalStorage } from "@alma/design-system";

import { APP_VERSION, APP_DEVICE_ID } from "@/constants/app";

export const useAppStore = defineStore("app-store", () => {
  const version = useTypedLocalStorage("VITE_APP_VERSION", APP_VERSION);
  const setVersion = (name: string): void => {
    version.value = name;
  };

  const deviceId = ref(APP_DEVICE_ID);

  const reset = (): void => {
    setVersion(APP_VERSION);
  };

  return {
    version,
    setVersion,
    deviceId,
    reset,
  };
});
