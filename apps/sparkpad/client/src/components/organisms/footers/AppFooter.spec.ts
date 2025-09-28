import { shallowMount } from "@vue/test-utils";

import { AppFooter } from "@/components/organisms";

describe("AppFooter", () => {
  describe("elements", () => {
    test("should render MainFooterTemplate component", () => {
      const wrapper = shallowMount(AppFooter);

      const footer = wrapper.findComponent({ name: "MainFooterTemplate" });
      const isFooterExists = footer.exists();

      expect(isFooterExists).toBeTruthy();
    });
  });
});
