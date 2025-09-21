import { shallowMount } from "@vue/test-utils";

import AppHeader from "./AppHeader.vue";

describe("AuthLayout", () => {
  describe("elements", () => {
    test("should render MainHeader component", () => {
      const wrapper = shallowMount(AppHeader);

      const header = wrapper.findComponent({ name: "MainHeader" });
      const isHeaderExists = header.exists();

      expect(isHeaderExists).toBeTruthy();
    });
  });
});
