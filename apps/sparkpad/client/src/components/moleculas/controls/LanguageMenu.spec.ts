import { mount, VueWrapper } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";

import ProtoLocaleMenu from "./LanguageMenu.vue";

const getDropdown = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.findComponent({ name: "Dropdown" });
};

describe("ProtoLocaleMenu", () => {
  const pinia = createPinia();
  setActivePinia(pinia);

  describe("elements", () => {
    test("should render Dropdown component", () => {
      const wrapper = mount(ProtoLocaleMenu);

      const dropdown = getDropdown(wrapper);
      const isDropdownExists = dropdown.exists();

      expect(isDropdownExists).toBeTruthy();
    });
  });
});
