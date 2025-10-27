import { mount } from "@vue/test-utils";

import { UIFACETS } from "@/constants/ui";

import ControlButton from "@/components/molecules/buttons/aliases/ControlButton.vue";

import {
  SECTION_HEADER_PREFIX,
  type SectionHeaderProps,
} from "./SectionHeader";
import SectionHeader from "./SectionHeader.vue";

const Classes = {
  ROOT_CLASS: SECTION_HEADER_PREFIX,
  VARIANT: `${SECTION_HEADER_PREFIX}_${UIFACETS.VARIANT}`,
  SIZE: `${SECTION_HEADER_PREFIX}_${UIFACETS.SIZE}`,
  MODE: `${SECTION_HEADER_PREFIX}_${UIFACETS.MODE}`,
  TONE: `${SECTION_HEADER_PREFIX}_${UIFACETS.TONE}`,
  STATE: `${SECTION_HEADER_PREFIX}_${UIFACETS.STATE}`,
} as const;

const Selectors = {
  TITLE: `.${Classes.ROOT_CLASS}__title-text`,
  CONTROLS: `.${Classes.ROOT_CLASS}__controls`,
};

const mountSectionHeader = (options?: {
  props?: SectionHeaderProps;
  slots?: Record<string, string>;
}) => {
  return mount(SectionHeader, {
    ...options,
    props: {
      as: "section",
      ...options?.props,
    },
  });
};

describe("SectionHeader", () => {
  describe("classes", () => {
    test("should apply facet classes and active state", () => {
      const props: SectionHeaderProps = {
        variant: "default",
        size: "md",
        mode: "neutral",
        tone: "primary",
        isActive: true,
      };

      const wrapper = mountSectionHeader({ props });

      expect(wrapper.classes()).toContain(
        `${Classes.VARIANT}-${props.variant}`
      );
      expect(wrapper.classes()).toContain(`${Classes.SIZE}-${props.size}`);
      expect(wrapper.classes()).toContain(`${Classes.MODE}-${props.mode}`);
      expect(wrapper.classes()).toContain(`${Classes.TONE}-${props.tone}`);
      expect(wrapper.classes()).toContain(`${Classes.STATE}-active`);
    });

    test("should fallback to normal state when not active", () => {
      const wrapper = mountSectionHeader({ props: { isActive: false } });

      expect(wrapper.classes()).toContain(`${Classes.STATE}-normal`);
    });
  });

  describe("elements", () => {
    test("should render title text", () => {
      const props: SectionHeaderProps = {
        title: "Projects",
      };

      const wrapper = mountSectionHeader({ props });
      const title = wrapper.find(Selectors.TITLE);

      expect(title.exists()).toBeTruthy();
      expect(title.text()).toMatchInlineSnapshot(`"Projects"`);
    });

    test("should render controls slot", () => {
      const slotContent = "Controls Slot";
      const wrapper = mountSectionHeader({
        slots: {
          controls: `<span data-testid="slot">${slotContent}</span>`,
        },
      });

      const controls = wrapper.find(Selectors.CONTROLS);
      const slot = wrapper.find(`[data-testid="slot"]`);

      expect(controls.exists()).toBeTruthy();
      expect(slot.text()).toEqual(slotContent);
      expect(slot.text()).toMatchInlineSnapshot(`"Controls Slot"`);
    });

    test("should toggle close button visibility", () => {
      const wrapper = mountSectionHeader({
        props: { isCloseButtonShown: false },
      });

      const button = wrapper.findComponent(ControlButton);

      expect(button.exists()).toBeFalsy();
    });
  });

  describe("events", () => {
    test("should emit close event when ControlButton fires click", () => {
      const wrapper = mountSectionHeader();

      const button = wrapper.findComponent(ControlButton);
      button.vm?.$emit("click");

      expect(wrapper.emitted("close")).toBeTruthy();
      expect(wrapper.emitted("close")?.length).toBe(1);
    });
  });
});
