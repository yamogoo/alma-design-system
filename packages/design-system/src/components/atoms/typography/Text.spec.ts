import { mount, shallowMount, VueWrapper } from "@vue/test-utils";

import { UIFACETS, UIMODIFIERS } from "@/constants/ui";

import { TEXT_PREFIX } from "./Text";
import Text from "./Text.vue";

const Classes = {
  ROOT_CLASS: TEXT_PREFIX,
  VARIANT: `${TEXT_PREFIX}_${UIFACETS.VARIANT}`,
  SIZE: `${TEXT_PREFIX}_${UIFACETS.SIZE}`,
  MODE: `${TEXT_PREFIX}_${UIFACETS.MODE}`,
  TONE: `${TEXT_PREFIX}_${UIFACETS.TONE}`,
  ALIGN: `${TEXT_PREFIX}_${UIMODIFIERS.ALIGN}`,
} as const;

const getText = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`.${Classes.ROOT_CLASS}`);
};

describe("Text", () => {
  describe("classes", () => {
    test("should have variant class", () => {
      const wrapper = shallowMount(Text, {
        props: {
          variant: "body-2",
        },
      });

      const el = getText(wrapper);

      expect(el.classes(`${Classes.VARIANT}-body-2`)).toBeTruthy();
    });

    test("should have color class", () => {
      const wrapper = shallowMount(Text, {
        props: {
          mode: "neutral",
        },
      });

      const el = getText(wrapper);

      expect(el.classes(`${Classes.MODE}-neutral`)).toBeTruthy();
    });
  });

  describe("styles", () => {
    test("pass styles from props", () => {
      const wrapper = mount(Text, {
        props: {
          display: "block",
          color: "red",
          align: "center",
          letterSpacing: "2px",
          textTransform: "uppercase",
          textDecoration: "underline",
          fontFamily: "Arial",
          fontStyle: "italic",
          fontStretch: "condensed",
          fontVariant: "small-caps",
          fontFeatureSettings: "'liga' 1",
          fontSynthesis: "none",
          textIndent: "10px",
        },
      });

      const style = wrapper.find("span").attributes("style");

      expect(style).toContain("display: block");
      expect(style).toContain("color: red");
      expect(style).toContain("text-align: center");
      expect(style).toContain("letter-spacing: 2px");
      expect(style).toContain("text-transform: uppercase");
      expect(style).toContain("text-decoration: underline");
      expect(style).toContain("font-family: Arial");
      expect(style).toContain("font-style: italic");
      expect(style).toContain("font-stretch: condensed");
      expect(style).toContain("font-variant: small-caps");
      expect(style).toContain("font-feature-settings: 'liga' 1");
      expect(style).toContain("font-synthesis: none");
      expect(style).toContain("text-indent: 10px");
    });

    test("adds overflow and whiteSpace if textOverflow is passed", () => {
      const wrapper = mount(Text, {
        props: {
          textOverflow: "ellipsis",
        },
      });

      const style = wrapper.find("span").attributes("style");

      expect(style).toContain("text-overflow: ellipsis");
      expect(style).toContain("overflow: hidden");
      expect(style).toContain("white-space: nowrap");
    });

    test("does not add overflow and whiteSpace if textOverflow is not passed", () => {
      const wrapper = mount(Text);

      const style = wrapper.find("span").attributes("style") || "";

      expect(style).not.toContain("overflow");
      expect(style).not.toContain("white-space");
    });
  });

  describe("slots", () => {
    test("should render default slot content", () => {
      const slotContent = "Some Content";

      const wrapper = shallowMount(Text, {
        slots: {
          default: slotContent,
        },
      });

      const el = getText(wrapper);
      const expectedSlotContent = el.text();

      expect(expectedSlotContent).toBe(slotContent);
    });
  });
});
