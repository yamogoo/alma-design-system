import { mount, VueWrapper } from "@vue/test-utils";

import { SKELETON_PREFIX, type SkeletonProps } from "./Skeleton";
import Skeleton from "./Skeleton.vue";

const Classes = {
  ROOT_CLASS: SKELETON_PREFIX,
  VARIANT: `${SKELETON_PREFIX}_variant`,
  SIZE: `${SKELETON_PREFIX}_size`,
  MODE: `${SKELETON_PREFIX}_mode`,
  TONE: `${SKELETON_PREFIX}_tone`,
} as const;

const getRoot = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`[data-testid="${Classes.ROOT_CLASS}"]`);
};

const getShape = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`.${Classes.ROOT_CLASS}__shape`);
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
      expect(getShape(wrapper).exists()).toBe(true);
    });
  });
});
