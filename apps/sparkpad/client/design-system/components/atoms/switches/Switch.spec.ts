import { describe, expect, test } from "vitest";
import { mount } from "@vue/test-utils";

import Switch from "./Switch.vue";

describe("Switch", () => {
  describe("props", () => {
    test.each([true, false])(
      "should render correctly with useNative=%s",
      (useNative) => {
        const wrapper = mount(Switch, {
          props: { useNative, isActive: true },
        });

        expect(wrapper.exists()).toBe(true);

        if (useNative) {
          expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true);
        }
      }
    );
  });
});
