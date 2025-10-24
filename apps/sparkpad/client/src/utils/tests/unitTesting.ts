import type { VueWrapper } from "@vue/test-utils";

export const getAppHeader = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find('[data-testid="app-header"]');
};
