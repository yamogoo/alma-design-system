import { describe, test, expect } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";

import StoryResizeBounding from "./StorySlotCover.vue";

const getResizeBounding = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.findComponent({ name: "ResizeBounding" });
};

describe("StoryResizeBounding", () => {
  describe("elements", () => {
    test("should render ResizeBounding component", () => {
      const wrapper = mount(StoryResizeBounding);

      const isResizeBoundingComponentExists =
        getResizeBounding(wrapper).exists();

      expect(isResizeBoundingComponentExists).toBeTruthy();
    });
  });
});
