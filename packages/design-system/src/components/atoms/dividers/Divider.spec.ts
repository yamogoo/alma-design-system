import { mount } from "@vue/test-utils";

import {
  DIVIDER_PREFIX,
  type DividerProps,
} from "@/components/atoms/dividers/Divider";
import Divider from "@/components/atoms/dividers/Divider.vue";

const Classes = {
  ROOT_CLASS: DIVIDER_PREFIX,
  VARIANT: `${DIVIDER_PREFIX}_variant`,
  SIZE: `${DIVIDER_PREFIX}_size`,
  MODE: `${DIVIDER_PREFIX}_mode`,
  ORIENTATION: `${DIVIDER_PREFIX}_orientation`,
  ALIGNMENT: `${DIVIDER_PREFIX}_align`,
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
