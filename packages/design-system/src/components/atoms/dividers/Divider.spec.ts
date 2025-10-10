import { mount } from "@vue/test-utils";

import { UIFACETS, UIMODIFIERS } from "@/constants/ui";

import { DIVIDER_PREFIX, type DividerProps } from "./Divider";
import Divider from "./Divider.vue";

const Classes = {
  ROOT_CLASS: DIVIDER_PREFIX,
  VARIANT: `${DIVIDER_PREFIX}_${UIFACETS.VARIANT}`,
  SIZE: `${DIVIDER_PREFIX}_${UIFACETS.SIZE}`,
  MODE: `${DIVIDER_PREFIX}_${UIFACETS.MODE}`,
  ORIENTATION: `${DIVIDER_PREFIX}_${UIMODIFIERS.ORIENTATION}`,
  ALIGNMENT: `${DIVIDER_PREFIX}_${UIMODIFIERS.ALIGN}`,
  ARIA_ORIENTATION: "aria-orientation",
} as const;

describe("Divider", () => {
  describe("classes", () => {
    test("should have props based classes (variant/size)", async () => {
      const props: DividerProps = {
        variant: "default",
        size: "md",
        mode: "neutral",
        tone: "primary",
        orientation: "horizontal",
        align: "center",
      };

      const wrapper = mount(Divider, { props });

      expect(wrapper.classes()).toContain(
        `${Classes.VARIANT}-${props.variant}`
      );
      expect(wrapper.classes()).toContain(`${Classes.SIZE}-${props.size}`);
      expect(wrapper.classes()).toContain(`${Classes.MODE}-${props.mode}`);

      expect(wrapper.classes()).toContain(
        `${Classes.ORIENTATION}-${props.orientation}`
      );
      expect(wrapper.classes()).toContain(
        `${Classes.ALIGNMENT}-${props.align}`
      );

      await wrapper.setProps({ orientation: "vertical" });
      expect(wrapper.attributes("aria-orientation")).toBe("vertical");

      await wrapper.setProps({ orientation: "horizontal" });
      expect(wrapper.attributes("aria-orientation")).toBe(undefined);
    });
  });
});
