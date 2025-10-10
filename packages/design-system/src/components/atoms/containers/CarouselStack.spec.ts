import { mount, VueWrapper } from "@vue/test-utils";

import { UIFACETS, UIMODIFIERS } from "@/constants/ui";

import {
  CAROUSEL_STACK_PREFIX,
  type CarousleStackProps,
} from "./CarouselStack";
import CarouselStack from "./CarouselStack.vue";

const Classes = {
  ROOT_CLASS: CAROUSEL_STACK_PREFIX,
  VARIANT: `${CAROUSEL_STACK_PREFIX}_${UIFACETS.VARIANT}`,
  SIZE: `${CAROUSEL_STACK_PREFIX}_${UIFACETS.SIZE}`,
  ORIENTATION: `${CAROUSEL_STACK_PREFIX}_${UIMODIFIERS.ORIENTATION}`,
  STRETCH: `${CAROUSEL_STACK_PREFIX}_${UIMODIFIERS.STRETCH}`,
  GRABBING: `${CAROUSEL_STACK_PREFIX}_${UIMODIFIERS.GRABBING}`,
  CLICKABLE: `${CAROUSEL_STACK_PREFIX}_${UIMODIFIERS.CLICKABLE}`,
  STATIC: `${CAROUSEL_STACK_PREFIX}_${UIMODIFIERS.STATIC}`,
} as const;

const getHeader = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`[data-testid="${CAROUSEL_STACK_PREFIX}__header"]`);
};

describe("CarouselStack", () => {
  describe("classes", () => {
    test("should have props based classes (variant/size)", async () => {
      const props: CarousleStackProps = {
        variant: "default",
        size: "lg",
        orientation: "horizontal",
        stretch: "auto",
        isDruggable: true,
        isItemsClickable: false,
        screenCount: 2,
      };

      const wrapper = mount(CarouselStack, { props });

      expect(wrapper.classes()).toContain(
        `${Classes.VARIANT}-${props.variant}`
      );
      expect(wrapper.classes()).toContain(`${Classes.SIZE}-${props.size}`);
      expect(wrapper.classes()).toContain(
        `${Classes.ORIENTATION}-${props.orientation}`
      );
      expect(wrapper.classes()).toContain(
        `${Classes.STRETCH}-${props.stretch}`
      );

      await wrapper.trigger("pointerdown");
      await wrapper.trigger("pointermove");

      expect(wrapper.classes()).toContain(`${Classes.STATIC}`);

      await wrapper.setProps({ isItemsClickable: true });
      expect(wrapper.classes()).toContain(`${Classes.CLICKABLE}`);
    });
  });

  describe("elements", () => {
    test("should render the header", () => {
      const slotContent = "Pagintaion Slot";
      const paginationSlot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mount(CarouselStack, {
        props: {
          screenCount: 3,
        },
        slots: { pagination: paginationSlot },
      });

      const headerEl = getHeader(wrapper);

      expect(headerEl.exists()).toBeTruthy();
    });

    test("should not render the header", () => {
      const wrapper = mount(CarouselStack, {
        props: {
          screenCount: 3,
        },
      });

      const headerEl = getHeader(wrapper);

      expect(headerEl.exists()).toBeFalsy();
    });
  });

  describe("slots", () => {
    test("should render pagination slot", () => {
      const slotContent = "Pagintaion Slot";
      const paginationSlot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mount(CarouselStack, {
        props: {
          screenCount: 3,
        },
        slots: { pagination: paginationSlot },
      });

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Pagintaion Slot"`);
    });

    test("should render screen slot", () => {
      const screenSlot = `<div data-testid="screen">Screen Content</div>`;

      const wrapper = mount(CarouselStack, {
        props: { screenCount: 1 },
        slots: { "screen-1": screenSlot },
      });

      const screenEl = wrapper.find('[data-testid="screen"]');
      expect(screenEl.exists()).toBeTruthy();
      expect(screenEl.text()).toBe("Screen Content");
    });
  });
});
