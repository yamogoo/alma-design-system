import { mount } from "@vue/test-utils";

import type { SurfaceProps } from "./Surface";
import Surface from "./Surface.vue";

enum Classes {
  ROOT_CLASS = "surface",
  VARIANT = `${Classes.ROOT_CLASS}_variant`,
  SIZE = `${Classes.ROOT_CLASS}_size`,
  MODE = `${Classes.ROOT_CLASS}_mode`,
  TONE = `${Classes.ROOT_CLASS}_tone`,
  ELEVATED = `${Classes.ROOT_CLASS}_elevated`,
  BORDER_SIDES = `${Classes.ROOT_CLASS}_border`,
}

describe("Surface", () => {
  describe("classes", () => {
    test("should have props based classes (variant/size/mode/tone)", () => {
      const props: SurfaceProps = {
        variant: "default",
        size: "md",
        mode: "neutral",
        tone: "primary",
        elevated: true,
        borderSides: "r",
      };

      const wrapper = mount(Surface, { props });

      expect(wrapper.classes()).toContain(
        `${Classes.VARIANT}-${props.variant}`
      );
      expect(wrapper.classes()).toContain(`${Classes.SIZE}-${props.size}`);
      expect(wrapper.classes()).toContain(`${Classes.MODE}-${props.mode}`);
      expect(wrapper.classes()).toContain(`${Classes.TONE}-${props.tone}`);
      expect(wrapper.classes()).toContain(`${Classes.ELEVATED}`);
      expect(wrapper.classes()).toContain(
        `${Classes.BORDER_SIDES}-${props.borderSides}`
      );
    });
  });

  describe("slots", () => {
    test("should render default slot", () => {
      const slotContent = "Slot Content";
      const slot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mount(Surface, {
        slots: { default: slot },
      });

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Slot Content"`);
    });
  });
});
