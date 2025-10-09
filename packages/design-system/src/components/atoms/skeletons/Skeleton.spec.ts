import { mount, VueWrapper } from "@vue/test-utils";

import type { SkeletonProps } from "./Skeleton";
import Skeleton from "./Skeleton.vue";

enum Classes {
  ROOT_CLASS = "skeleton",
  VARIANT = `${Classes.ROOT_CLASS}_variant`,
  SIZE = `${Classes.ROOT_CLASS}_size`,
  MODE = `${Classes.ROOT_CLASS}_mode`,
  TONE = `${Classes.ROOT_CLASS}_tone`,
}

const getRoot = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`[data-testid="${Classes.ROOT_CLASS}"]`);
};

describe("Skeleton", () => {
  describe("classes", () => {
    test("renders skeleton with default aria attributes and styling tokens", () => {
      const props: SkeletonProps = {
        variant: "default",
        size: "md",
        mode: "neutral",
        tone: "primary",
      };

      const wrapper = mount(Skeleton, {
        props,
      });

      expect(wrapper.classes()).toContain(
        `${Classes.VARIANT}-${props.variant}`
      );
      expect(wrapper.classes()).toContain(`${Classes.SIZE}-${props.size}`);
      expect(wrapper.classes()).toContain(`${Classes.MODE}-${props.mode}`);
      expect(wrapper.classes()).toContain(`${Classes.TONE}-${props.tone}`);
    });

    test("renders skeleton with default aria attributes", () => {
      const wrapper = mount(Skeleton);

      const root = getRoot(wrapper);

      expect(root.attributes("aria-label")).toBe("skeleton");
      expect(root.attributes("aria-busy")).toBe("true");
      expect(root.find(".skeleton__shape").exists()).toBe(true);
    });
  });
});
