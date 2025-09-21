import { mount } from "@vue/test-utils";

import { getTypedEmittedEvent } from "@/utils";

import { MenuItem } from ".";

describe("MenuItem", () => {
  describe("events", () => {
    test("should emit 'select' event", async () => {
      const wrapper = mount(MenuItem, {
        props: {
          isActive: false,
        },
      });

      await wrapper.trigger("pointerdown");
      const emittedEvent = getTypedEmittedEvent(wrapper, "is-pressed")[0][0];

      expect(wrapper.emitted()).toHaveProperty("press");
      expect(wrapper.emitted()).toHaveProperty("is-pressed");
      expect(emittedEvent).toMatchInlineSnapshot(`true`);

      await wrapper.trigger("pointerup");
      const emittedEvent2 = getTypedEmittedEvent(wrapper, "is-pressed")[1][0];

      expect(wrapper.emitted()).toHaveProperty("release");
      expect(wrapper.emitted()).toHaveProperty("is-pressed");
      expect(emittedEvent2).toMatchInlineSnapshot(`false`);
    });
  });
});
