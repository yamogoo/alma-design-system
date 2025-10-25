import { mount, type VueWrapper } from "@vue/test-utils";

import { UIMODIFIERS } from "@/constants/ui";

import { SCROLL_VIEW_PREFIX, type ScrollViewProps } from "./ScrollView";
import ScrollView from "./ScrollView.vue";

const Classes = {
  ROOT_CLASS: SCROLL_VIEW_PREFIX,
  ORIENTATION: `${SCROLL_VIEW_PREFIX}_${UIMODIFIERS.ORIENTATION}`,
  HIDDEN_SCROLLBAR: `${SCROLL_VIEW_PREFIX}--hidden-scrollbar`,
} as const;

const mountScrollView = (
  options: {
    props?: ScrollViewProps;
    slots?: Record<string, string>;
  } = {}
) => {
  return mount(ScrollView, {
    ...options,
    props: {
      as: "section",
      ...options.props,
    },
  }) as VueWrapper<InstanceType<typeof ScrollView>>;
};

describe("ScrollView", () => {
  describe("classes", () => {
    test("should apply orientation modifier", () => {
      const props: ScrollViewProps = {
        direction: "horizontal",
      };

      const wrapper = mountScrollView({ props });

      expect(wrapper.classes()).toContain(Classes.ROOT_CLASS);
      expect(wrapper.classes()).toContain(
        `${Classes.ORIENTATION}-${props.direction}`
      );
    });

    test("should hide scrollbar when prop enabled", () => {
      const wrapper = mountScrollView({
        props: {
          hideScrollbar: true,
        },
      });

      expect(wrapper.classes()).toContain(Classes.HIDDEN_SCROLLBAR);
    });
  });

  describe("slots", () => {
    test("should render default slot", () => {
      const slotContent = "Scrollable Content";
      const slot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mountScrollView({
        slots: {
          default: slot,
        },
      });

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Scrollable Content"`);
    });
  });
});
