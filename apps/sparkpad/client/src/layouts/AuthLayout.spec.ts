import { nextTick } from "vue";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";

import { PageStub, RouterViewStub } from "@/utils";

import AuthLayout from "./AuthLayout.vue";

const getHeader = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.findComponent({ name: "AppHeader" });
};

const getFooter = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.findComponent({ name: "AppFooter" });
};

describe("AuthLayout", () => {
  let pinia: ReturnType<typeof createPinia>;

  const mountLayout = () =>
    shallowMount(AuthLayout, {
      global: {
        plugins: [pinia],
        stubs: {
          Page: PageStub,
          RouterView: RouterViewStub,
        },
      },
    });

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe("elements", () => {
    test("should render Page component", () => {
      const wrapper = mountLayout();

      const page = wrapper.findComponent({ name: "Page" });
      const isPageExists = page.exists();

      expect(isPageExists).toBeTruthy();
    });

    test("should render AppHeader component", async () => {
      const wrapper = mountLayout();

      await nextTick();
      const header = getHeader(wrapper);
      const isHeaderExists = header.exists();

      expect(isHeaderExists).toBeTruthy();
    });

    test("should render AppFooter component", async () => {
      const wrapper = mountLayout();

      await nextTick();
      const footer = getFooter(wrapper);
      const isFooterExists = footer.exists();

      expect(isFooterExists).toBeTruthy();
    });
  });
});
