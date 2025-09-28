import { mount } from "@vue/test-utils";

import { Overlay, type OverlayProps } from "@/components/atoms";

enum Classes {
  ROOT_CLASS = "overlay",
  MODE = `${Classes.ROOT_CLASS}_mode`,
}

describe("Overlay", () => {
  describe("classes", () => {
    test("should have props based classes (mode)", () => {
      const props: OverlayProps = {
        mode: "primary",
      };

      const wrapper = mount(Overlay, { props });

      expect(wrapper.classes()).toContain(`${Classes.MODE}-${props.mode}`);
      expect(wrapper.classes()).toContain(`${Classes.MODE}-${props.mode}`);
    });
  });
});
