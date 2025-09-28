import { mount, VueWrapper } from "@vue/test-utils";

import { ToolbarBlock } from ".";

const getGroup = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.findComponent({ name: "Group" });
};

describe("ToolbarBlock", () => {
  describe("elements", () => {
    test("should render Group component", () => {
      const wrapper = mount(ToolbarBlock);

      const component = getGroup(wrapper);
      const isComponentExists = component.exists();

      expect(isComponentExists).toBeTruthy();
      expect(isComponentExists).toMatchInlineSnapshot(`true`);
    });
  });
});
