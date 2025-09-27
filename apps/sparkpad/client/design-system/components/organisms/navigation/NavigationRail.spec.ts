import { mount, VueWrapper } from "@vue/test-utils";

import {
  NavigationRail,
  type NavigationRailProps,
} from "@/components/organisms";

const getHeaderGroup = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find('[data-testid="navigation-rail-header"]');
};

const getFooterGroup = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find('[data-testid="navigation-rail-footer"]');
};

const REQUIRED_PROPS: NavigationRailProps = {
  items: [],
  selectedItemId: 0,
};

describe("NavigationRail", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  describe("elements", () => {
    test("should render header and footer Groups", () => {
      const wrapper = mount(NavigationRail, {
        props: REQUIRED_PROPS,
      });

      const headerGroup = getHeaderGroup(wrapper);
      const isHeaderGroupExists = headerGroup.exists();

      const footerGroup = getFooterGroup(wrapper);
      const isFooterGroupExists = footerGroup.exists();

      expect(isHeaderGroupExists).toBeTruthy();
      expect(isFooterGroupExists).toBeTruthy();
    });
  });

  describe("NavigationRail", () => {
    describe("slots", () => {
      test("should render default slot", async () => {
        const slotContent = "Slot Content";
        const slot = `<p data-testid="slot">${slotContent}</p>`;

        const wrapper = mount(NavigationRail, {
          props: REQUIRED_PROPS,
          slots: { default: slot },
        });

        const slotEl = wrapper.find(`[data-testid="slot"]`);
        const text = slotEl.text();

        expect(text).toEqual(slotContent);
        expect(text).toMatchInlineSnapshot(`"Slot Content"`);
      });

      test("should render header section slot", async () => {
        const slotContent = "Slot Content";
        const slot = `<p data-testid="slot">${slotContent}</p>`;

        const wrapper = mount(NavigationRail, {
          props: REQUIRED_PROPS,
          slots: { header: slot },
        });

        const slotEl = wrapper.find(`[data-testid="slot"]`);
        const text = slotEl.text();

        expect(text).toEqual(slotContent);
        expect(text).toMatchInlineSnapshot(`"Slot Content"`);
      });

      test("should render footer section slot", async () => {
        const slotContent = "Slot Content";
        const slot = `<p data-testid="slot">${slotContent}</p>`;

        const wrapper = mount(NavigationRail, {
          props: REQUIRED_PROPS,
          slots: { footer: slot },
        });

        const slotEl = wrapper.find(`[data-testid="slot"]`);
        const text = slotEl.text();

        expect(text).toEqual(slotContent);
        expect(text).toMatchInlineSnapshot(`"Slot Content"`);
      });

      test("header slot overrides default header content", () => {
        const wrapper = mount(NavigationRail, {
          props: REQUIRED_PROPS,
          slots: { header: '<div data-testid="hdr">H</div>' },
        });
        expect(wrapper.find('[data-testid="hdr"]').exists()).toBe(true);
        expect(wrapper.findComponent({ name: "Logo" }).exists()).toBe(false);
      });

      test("footer slot overrides default footer content", () => {
        const wrapper = mount(NavigationRail, {
          props: REQUIRED_PROPS,
          slots: { footer: '<div data-testid="ftr">F</div>' },
        });
        expect(wrapper.find('[data-testid="ftr"]').exists()).toBe(true);
        expect(wrapper.findComponent({ name: "ControlButton" }).exists()).toBe(
          false
        );
      });
    });
  });
});
