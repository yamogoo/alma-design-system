import { shallowMount } from "@vue/test-utils";

import AppHeader from "@/components/organisms/headers/AppHeader.vue";

describe("AppHeader", () => {
  describe("elements", () => {
    test("should render MainHeader component", () => {
      const wrapper = shallowMount(AppHeader);

      const header = wrapper.findComponent({ name: "MainHeaderTemplate" });
      const isHeaderExists = header.exists();

      expect(isHeaderExists).toBeTruthy();
    });
  });
});
