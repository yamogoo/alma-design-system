import { mount } from "@vue/test-utils";
import { describe, test, expect } from "vitest";

import { AnimatedIcon, type AnimatedIconProps } from "@/components/atoms";

import animationData from "@/assets/animations/spinner.json";

const REQUIRED_PROPS: AnimatedIconProps = {
  animationData,
  isActive: false,
};

describe("AnimatedIcon", () => {
  describe("elements", () => {
    const wrapper = mount(AnimatedIcon, { props: REQUIRED_PROPS });

    test("should render lottie (svg) dom element", async () => {
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
