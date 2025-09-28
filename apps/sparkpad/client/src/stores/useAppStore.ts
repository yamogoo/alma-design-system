import { ref } from "vue";
import { defineStore } from "pinia";
import { Composables } from "@alma/design-system";

const { useTypedLocalStorage } = Composables.Local;

export const DEFAULT_APP_VERSION = import.meta.env.VITE_APP_VERSION;
export const APP_DEVICE_ID = import.meta.env.VITE_APP_DEVICE_ID;

export const useAppStore = defineStore("app-store", () => {
  const version = useTypedLocalStorage("VITE_APP_VERSION", DEFAULT_APP_VERSION);

  const setVersion = (name: string): void => {
    version.value = name;
  };

  const deviceId = ref(APP_DEVICE_ID);

  return {
    version,
    setVersion,
    deviceId,
  };
});
