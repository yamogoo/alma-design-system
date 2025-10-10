import { mount, shallowMount, VueWrapper } from "@vue/test-utils";
import gsap from "gsap";

import { UIFACETS } from "@/constants/ui";

import { type ButtonProps, BUTTON_PREFIX } from "./Button";
import Button from "./Button.vue";

const Classes = {
  ROOT_CLASS: BUTTON_PREFIX,
  VARIANT: `${BUTTON_PREFIX}_${UIFACETS.VARIANT}`,
  SIZE: `${BUTTON_PREFIX}_${UIFACETS.SIZE}`,
  MODE: `${BUTTON_PREFIX}_${UIFACETS.MODE}`,
  TONE: `${BUTTON_PREFIX}_${UIFACETS.TONE}`,
} as const;

const REQUIRED_PROPS: Pick<ButtonProps, "tone" | "mode"> = {
  mode: "neutral",
  tone: "primary",
};

const getIcon = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`[data-testid="${Classes.ROOT_CLASS}__icon"]`);
};

vi.mock("gsap", () => ({
  default: {
    to: vi.fn(),
  },
}));

describe("Button.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("classes", () => {
    test("renders with base classes and attributes", () => {
      const props: ButtonProps = {
        size: "md",
      };

      const wrapper = mount(Button, {
        props: { ...REQUIRED_PROPS, ...props },
      });

      const btn = wrapper.get(`[data-testid='${Classes.ROOT_CLASS}']`);

      expect(btn.classes()).toContain(Classes.ROOT_CLASS);
      expect(btn.classes()).toContain(`${Classes.SIZE}-${props.size}`);
      expect(btn.classes()).toContain(`${Classes.MODE}-${REQUIRED_PROPS.mode}`);
      expect(btn.classes()).toContain(`${Classes.TONE}-${REQUIRED_PROPS.tone}`);
    });
  });

  describe("attributes", () => {
    test("sets aria-label by label props", () => {
      const wrapper = mount(Button, {
        props: { size: "md", ...REQUIRED_PROPS, label: "Click me" },
      });

      const buttonEl = wrapper.get(`[data-testid='${Classes.ROOT_CLASS}']`);

      expect(buttonEl.attributes("aria-label")).toBe("Click me");
    });
  });

  describe("elements", () => {
    test("renders prepend and append icons", () => {
      const wrapper = shallowMount(Button, {
        props: {
          size: "md",
          ...REQUIRED_PROPS,
          prependIconName: "back",
          appendIconName: "check",
        },
      });

      const icons = wrapper.findAllComponents({ name: "Icon" });

      expect(icons.length).toBe(2);
      expect(icons[0].props("name")).toBe("back");
      expect(icons[1].props("name")).toBe("check");
    });
  });

  describe("animations", () => {
    test("runs gsap.to on pointerdown and pointerup", async () => {
      const wrapper = mount(Button, {
        props: { size: "md", ...REQUIRED_PROPS },
        attachTo: document.body,
      });

      const btnEl = wrapper.get(`[data-testid='${BUTTON_PREFIX}']`)
        .element as HTMLButtonElement;

      await wrapper
        .get(`[data-testid='${BUTTON_PREFIX}']`)
        .trigger("pointerdown");
      expect(gsap.to).toHaveBeenLastCalledWith(
        btnEl,
        expect.objectContaining({
          scale: 0.95,
          duration: 0.05,
          ease: "power4.out",
        })
      );

      await wrapper
        .get(`[data-testid='${BUTTON_PREFIX}']`)
        .trigger("pointerup");
      expect(gsap.to).toHaveBeenLastCalledWith(
        btnEl,
        expect.objectContaining({
          scale: 1,
          duration: 0.05,
          ease: "power4.in",
        })
      );
    });

    test("custom scale is usedPressed", async () => {
      const wrapper = mount(Button, {
        props: {
          size: "md",
          ...REQUIRED_PROPS,
          scalePressed: 0.8,
        },
      });

      const btnEl = wrapper.get(`[data-testid='${BUTTON_PREFIX}']`)
        .element as HTMLButtonElement;

      await wrapper
        .get(`[data-testid='${BUTTON_PREFIX}']`)
        .trigger("pointerdown");

      expect(gsap.to).toHaveBeenCalledWith(
        btnEl,
        expect.objectContaining({
          scale: 0.8,
        })
      );
    });
  });

  describe("slots", () => {
    test("renders custom prepend icon in slots", () => {
      const expectedSlotContent = "Icon";
      const expectedSlot = `<span data-testid="${BUTTON_PREFIX}__icon">${expectedSlotContent}</span>`;

      const wrapper = shallowMount(Button, {
        props: {
          size: "md",
          ...REQUIRED_PROPS,
        },
        slots: {
          "prepend-icon": expectedSlot,
        },
      });

      const iconEl = getIcon(wrapper);
      const isIconExists = iconEl.exists();

      expect(isIconExists).toBeTruthy();
      expect(isIconExists).toMatchInlineSnapshot(`true`);
    });

    test("renders custom append icon in slots", () => {
      const expectedSlotContent = "Icon";
      const expectedSlot = `<span data-testid="${BUTTON_PREFIX}__icon">${expectedSlotContent}</span>`;

      const wrapper = shallowMount(Button, {
        props: {
          size: "md",
          ...REQUIRED_PROPS,
        },
        slots: {
          "append-icon": expectedSlot,
        },
      });

      const iconEl = getIcon(wrapper);
      const isIconExists = iconEl.exists();

      expect(isIconExists).toBeTruthy();
      expect(isIconExists).toMatchInlineSnapshot(`true`);
    });
  });
});
