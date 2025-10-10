import { mount, VueWrapper } from "@vue/test-utils";

import { UIFACETS } from "@/constants/ui";

import { SKELETON_PREFIX, type SkeletonProps } from "./Skeleton";
import Skeleton from "./Skeleton.vue";

const Classes = {
  ROOT_CLASS: SKELETON_PREFIX,
  VARIANT: `${SKELETON_PREFIX}_${UIFACETS.VARIANT}`,
  SIZE: `${SKELETON_PREFIX}_${UIFACETS.SIZE}`,
  MODE: `${SKELETON_PREFIX}_${UIFACETS.MODE}`,
  TONE: `${SKELETON_PREFIX}_${UIFACETS.TONE}`,
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
