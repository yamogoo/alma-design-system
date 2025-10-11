import { mount, VueWrapper } from "@vue/test-utils";

import { UIFACETS } from "@/constants/ui";

import {
  NAVIGATION_RAIL_PREFIX,
  type NavigationRailTemplateProps,
} from "@/components/templates/navigation/NavigationRailTemplate";
import NavigationRailTemplate from "@/components/templates/navigation/NavigationRailTemplate.vue";

const Classes = {
  ROOT_CLASS: NAVIGATION_RAIL_PREFIX,
  VARIANT: `${NAVIGATION_RAIL_PREFIX}_${UIFACETS.VARIANT}`,
  SIZE: `${NAVIGATION_RAIL_PREFIX}_${UIFACETS.SIZE}`,
  MODE: `${NAVIGATION_RAIL_PREFIX}_${UIFACETS.MODE}`,
  TONE: `${NAVIGATION_RAIL_PREFIX}_${UIFACETS.TONE}`,
};

const getHeader = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`.${NAVIGATION_RAIL_PREFIX}__header`);
};

const getBody = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`.${NAVIGATION_RAIL_PREFIX}__body`);
};

const getFooter = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`.${NAVIGATION_RAIL_PREFIX}__footer`);
};

describe("NavigationRailTemplate", () => {
  describe("props", () => {
    test("applies default classes when no props passed", () => {
      const wrapper = mount(NavigationRailTemplate);
      expect(wrapper.classes()).toEqual(
        expect.arrayContaining([
          NAVIGATION_RAIL_PREFIX,
          `${NAVIGATION_RAIL_PREFIX}_${UIFACETS.VARIANT}-default`,
          `${NAVIGATION_RAIL_PREFIX}_${UIFACETS.SIZE}-lg`,
          `${NAVIGATION_RAIL_PREFIX}_${UIFACETS.MODE}-neutral`,
          `${NAVIGATION_RAIL_PREFIX}_${UIFACETS.TONE}-primary`,
        ])
      );
    });
  });

  describe("classes/attributes", () => {
    test("should have props based classes (variant/size)", () => {
      const props: NavigationRailTemplateProps = {
        variant: "default",
        size: "md",
        tone: "primary",
        mode: "neutral",
      };

      const wrapper = mount(NavigationRailTemplate, { props });

      expect(wrapper.classes()).toContain(
        `${Classes.VARIANT}-${props.variant}`
      );
      expect(wrapper.classes()).toContain(`${Classes.SIZE}-${props.size}`);
      expect(wrapper.classes()).toContain(`${Classes.TONE}-${props.tone}`);
      expect(wrapper.classes()).toContain(`${Classes.MODE}-${props.mode}`);
    });

    test("should have role=navigation", () => {
      const wrapper = mount(NavigationRailTemplate);
      expect(wrapper.attributes("role")).toBe("navigation");
    });
  });

  describe("elements", () => {
    test("does not render header/body/footer wrappers without corresponding slots", () => {
      const wrapper = mount(NavigationRailTemplate);

      expect(getHeader(wrapper).exists()).toBe(false);
      expect(getBody(wrapper).exists()).toBe(false);
      expect(getFooter(wrapper).exists()).toBe(false);
    });
  });

  describe("slots", () => {
    test("should render default slot", () => {
      const slotContent = "Slot Content";
      const slot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mount(NavigationRailTemplate, {
        slots: { default: slot },
      });

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Slot Content"`);
    });

    test("should render header section slot", () => {
      const slotContent = "Slot Content";
      const slot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mount(NavigationRailTemplate, {
        slots: { header: slot },
      });

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Slot Content"`);
    });

    test("should render footer section slot", () => {
      const slotContent = "Slot Content";
      const slot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mount(NavigationRailTemplate, {
        slots: { footer: slot },
      });

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Slot Content"`);
    });

    test("renders header/body/footer wrappers when slots provided", () => {
      const wrapper = mount(NavigationRailTemplate, {
        slots: {
          header: "<div>H</div>",
          default: "<div>B</div>",
          footer: "<div>F</div>",
        },
      });
      expect(getHeader(wrapper).exists()).toBe(true);
      expect(getBody(wrapper).exists()).toBe(true);
      expect(getFooter(wrapper).exists()).toBe(true);
    });
  });
});
