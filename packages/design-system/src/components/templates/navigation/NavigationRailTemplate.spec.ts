import { mount } from "@vue/test-utils";

import {
  NavigationRailTemplate,
  type NavigationRailTemplateProps,
} from "@/components/templates";

enum Classes {
  ROOT_CLASS = "navigation-rail",
  VARIANT = `${Classes.ROOT_CLASS}_variant`,
  SIZE = `${Classes.ROOT_CLASS}_size`,
  MODE = `${Classes.ROOT_CLASS}_mode`,
  TONE = `${Classes.ROOT_CLASS}_tone`,
}

describe("NavigationRailTemplate", () => {
  describe("props", () => {
    test("applies default classes when no props passed", () => {
      const wrapper = mount(NavigationRailTemplate);
      expect(wrapper.classes()).toEqual(
        expect.arrayContaining([
          "navigation-rail",
          "navigation-rail_variant-default",
          "navigation-rail_size-lg",
          "navigation-rail_mode-primary",
          "navigation-rail_tone-neutral",
        ])
      );
    });
  });

  describe("classes/attributes", () => {
    test("should have props based classes (variant/size)", () => {
      const props: NavigationRailTemplateProps = {
        variant: "default",
        size: "md",
        tone: "neutral",
        mode: "primary",
      };

      const wrapper = mount(NavigationRailTemplate, { props });

      expect(wrapper.classes()).toContain(
        `${Classes.VARIANT}-${props.variant}`
      );
      expect(wrapper.classes()).toContain(`${Classes.SIZE}-${props.size}`);
      expect(wrapper.classes()).toContain(`${Classes.TONE}-${props.tone}`);
      expect(wrapper.classes()).toContain(`${Classes.MODE}-${props.mode}`);
    });

    test("updates modifier classes when props change", async () => {
      const wrapper = mount(NavigationRailTemplate, {
        props: {
          variant: "default",
          size: "lg",
          mode: "primary",
          tone: "neutral",
        },
      });
      await wrapper.setProps({
        variant: "default",
        size: "md",
        mode: "primary",
        tone: "accent",
      });
      expect(wrapper.classes()).toEqual(
        expect.arrayContaining([
          "navigation-rail_variant-default",
          "navigation-rail_size-md",
          "navigation-rail_mode-primary",
          "navigation-rail_tone-accent",
        ])
      );
    });

    test("should have role=navigation", () => {
      const wrapper = mount(NavigationRailTemplate);
      expect(wrapper.attributes("role")).toBe("navigation");
    });
  });

  describe("elements", () => {
    test("does not render header/body/footer wrappers without corresponding slots", () => {
      const wrapper = mount(NavigationRailTemplate);

      expect(wrapper.find(".navigation-rail__header").exists()).toBe(false);
      expect(wrapper.find(".navigation-rail__body").exists()).toBe(false);
      expect(wrapper.find(".navigation-rail__footer").exists()).toBe(false);
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
      expect(wrapper.find(".navigation-rail__header").exists()).toBe(true);
      expect(wrapper.find(".navigation-rail__body").exists()).toBe(true);
      expect(wrapper.find(".navigation-rail__footer").exists()).toBe(true);
    });
  });
});
