import { describe, test, expect } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";

import StorySlotCover from "@/stories/components/molecules/covers/StorySlotCover.vue";

const getTitle = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(".story-slot-cover__title");
};

const getDescription = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(".story-slot-cover__description");
};

describe("StoryResizeBounding", () => {
  describe("elements", () => {
    test("should render Text components component", () => {
      const wrapper = mount(StorySlotCover);

      const description = getDescription(wrapper);
      const isDescriptionExists = description.exists();

      const title = getTitle(wrapper);
      const isTitleExists = title.exists();

      expect(isTitleExists).toBeTruthy();
      expect(isDescriptionExists).toBeTruthy();
    });
  });
});
