import { mount, VueWrapper } from "@vue/test-utils";

import { UIFACETS } from "@/constants/ui";

import { SNACKBAR_PREFIX, type SnackbarProps } from "./Snackbar";
import Snackbar from "./Snackbar.vue";

const Classes = {
  ROOT_CLASS: SNACKBAR_PREFIX,
  VARIANT: `${SNACKBAR_PREFIX}_${UIFACETS.VARIANT}`,
  SIZE: `${SNACKBAR_PREFIX}_${UIFACETS.SIZE}`,
} as const;

const getTitle = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`[data-testid="${Classes.ROOT_CLASS}__title"]`);
};

const getDescription = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`[data-testid="${Classes.ROOT_CLASS}__description"]`);
};

describe("Snackbar", () => {
  describe("classes", () => {
    test("should have props based classes (variant/size)", () => {
      const props: SnackbarProps = {
        variant: "default",
        size: "md",
        mode: "neutral",
        tone: "primary",
      };

      const wrapper = mount(Snackbar, { props });

      expect(wrapper.classes()).toContain(
        `${Classes.VARIANT}-${props.variant}`
      );
      expect(wrapper.classes()).toContain(`${Classes.SIZE}-${props.size}`);
    });
  });

  describe("elements", () => {
    test("should render title and description", () => {
      const props: SnackbarProps = {
        title: "Some Title",
        description: "Some Description",
      };

      const wrapper = mount(Snackbar, { props });

      const title = getTitle(wrapper);
      const description = getDescription(wrapper);

      expect(title.exists()).toBeTruthy();
      expect(description.exists()).toBeTruthy();
    });

    test("should render CloseButton", () => {
      const wrapper = mount(Snackbar, {
        props: {
          isCloseButtonShown: true,
        },
      });

      const button = wrapper.findComponent({ name: "ControlButton" });

      expect(button.exists()).toBeTruthy();
    });
  });

  describe("slots", () => {
    test("should render default slot", () => {
      const slotContent = "Slot Content";
      const slot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mount(Snackbar, {
        slots: { default: slot },
      });

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Slot Content"`);
    });
  });
});
