import { mount, VueWrapper } from "@vue/test-utils";

import type { OverlayProps } from "./Overlay";
import Overlay from "./Overlay.vue";

enum Classes {
  ROOT_CLASS = "overlay",
  BASE_CLASS_NAME = "surface",
  MODE = `${Classes.BASE_CLASS_NAME}_mode`,
}

const getSurface = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.findComponent({ name: "Surface" });
};

describe("Overlay", () => {
  describe("elements", () => {
    test("should render Surface componnt", () => {
      const wrapper = mount(Overlay);

      const surface = getSurface(wrapper);
      const isSurfaceExists = surface.exists();

      expect(isSurfaceExists).toBeTruthy();
    });
  });

  describe("classes", () => {
    test("should have props based classes (mode)", () => {
      const props: OverlayProps = {
        mode: "neutral",
      };

      const wrapper = mount(Overlay, { props });

      expect(wrapper.classes()).toContain(`${Classes.MODE}-${props.mode}`);
      expect(wrapper.classes()).toContain(`${Classes.MODE}-${props.mode}`);
    });
  });
});
