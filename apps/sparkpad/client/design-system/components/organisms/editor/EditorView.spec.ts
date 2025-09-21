import { mount, VueWrapper } from "@vue/test-utils";

import EditorView from "./EditorView.vue";

const getNavigator = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find("[data-test='editor-navigator']");
};

describe("EditorView", () => {
  describe("rendering", () => {
    test("should render the navigator", () => {
      const wrapper = mount(EditorView);

      const navigator = getNavigator(wrapper);

      expect(navigator.exists()).toBeTruthy();
    });
  });
});
