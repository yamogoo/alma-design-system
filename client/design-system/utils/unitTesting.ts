import type { VueWrapper } from "@vue/test-utils";

export const getButton = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.findComponent({ name: "Button" });
};

export const getInput = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.findComponent({ name: "Input" });
};

export const getDivider = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.findComponent({ name: "Divider" });
};

export const getGroup = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.findComponent({ name: "Group" });
};

export const getText = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.findComponent({ name: "Text" });
};

export const getLogo = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.findComponent({ name: "Logo" });
};
