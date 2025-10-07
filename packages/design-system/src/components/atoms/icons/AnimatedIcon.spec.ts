import { mount } from "@vue/test-utils";
import { describe, test, expect } from "vitest";

import { type AnimatedIconProps } from "@/components/atoms/icons/AnimatedIcon";
import AnimatedIcon from "@/components/atoms/icons/AnimatedIcon.vue";

import animationData from "@/assets/animations/spinner.json";

const REQUIRED_PROPS: AnimatedIconProps = {
  animationData,
  isActive: false,
};

describe("AnimatedIcon", () => {
  describe("elements", () => {
    const wrapper = mount(AnimatedIcon, { props: REQUIRED_PROPS });

    test("should render lottie (svg) dom element", () => {
      const container = wrapper.find(`.animated-icon`);
      const isContainerExists = container.exists();

      expect(isContainerExists).toBeTruthy();

      const svg = container.find("svg");
      const isSVGExists = svg.exists();

      expect(isSVGExists).toBeTruthy();
      expect(isSVGExists).toMatchInlineSnapshot(`true`);
    });
  });
});
