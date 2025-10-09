import { mount } from "@vue/test-utils";

import { PREFIX, type SurfaceProps } from "./Surface";
import Surface from "./Surface.vue";

const Classes = {
  ROOT_CLASS: PREFIX,
  VARIANT: `${PREFIX}_variant`,
  SIZE: `${PREFIX}_size`,
  MODE: `${PREFIX}_mode`,
  TONE: `${PREFIX}_tone`,
  ELEVATED: `${PREFIX}_elevated`,
  BORDER_SIDES: `${PREFIX}_border`,
} as const;

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
