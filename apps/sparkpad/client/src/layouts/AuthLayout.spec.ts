import { shallowMount } from "@vue/test-utils";

import AuthLayout from "./AuthLayout.vue";

describe("AuthLayout", () => {
  describe("elements", () => {
    test("should render Page component", () => {
      const wrapper = shallowMount(AuthLayout);

      const page = wrapper.findComponent({ name: "Page" });
      const isPageExists = page.exists();

      expect(isPageExists).toBeTruthy();
    });
  });
});
