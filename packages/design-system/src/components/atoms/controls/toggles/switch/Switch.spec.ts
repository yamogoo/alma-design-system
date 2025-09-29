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

  describe("elements", () => {
    test("should render label when provided (custom)", () => {
      const label = "Enable notifications";
      const wrapper = mount(Switch, {
        props: { useNative: false, label },
      });

      expect(wrapper.text()).toContain(label);
      const root = wrapper.find('[role="switch"]');
      expect(root.exists()).toBe(true);
    });

    test("should render label when provided (native)", () => {
      const label = "Enable email";
      const wrapper = mount(Switch, {
        props: { useNative: true, label },
      });

      expect(wrapper.text()).toContain(label);
      const input = wrapper.find('input[type="checkbox"]');
      expect(input.exists()).toBe(true);
    });
  });

  describe("events", () => {
    test("should emit update on native change (true -> false)", async () => {
      const wrapper = mount(Switch, {
        props: { useNative: true, isActive: false },
      });

      const input = wrapper.find('input[type="checkbox"]');
      expect(input.exists()).toBe(true);

      (input.element as HTMLInputElement).checked = true;
      await input.trigger("change");
      expect(wrapper.emitted("update:is-active")?.[0]).toEqual([true]);

      (input.element as HTMLInputElement).checked = false;
      await input.trigger("change");
      expect(wrapper.emitted("update:is-active")?.[1]).toEqual([false]);
    });

    test("should emit update on custom pointer click (toggle)", async () => {
      const wrapper = mount(Switch, {
        props: { useNative: false, isActive: false },
      });

      const root = wrapper.find('[role="switch"]');
      expect(root.exists()).toBe(true);

      await root.trigger("pointerdown");
      await root.trigger("pointerup");

      expect(wrapper.emitted("update:is-active")?.[0]).toEqual([true]);

      expect(root.attributes("aria-checked")).toBe("true");
    });

    test("should emit update on keyboard Space/Enter (custom)", async () => {
      const wrapper = mount(Switch, {
        props: { useNative: false, isActive: false },
      });

      const root = wrapper.find('[role="switch"]');
      expect(root.exists()).toBe(true);

      await root.trigger("keydown", { key: " " });
      expect(wrapper.emitted("update:is-active")?.[0]).toEqual([true]);

      await root.trigger("keydown", { key: "Enter" });
      expect(
        wrapper.emitted("update:is-active")?.length
      ).toBeGreaterThanOrEqual(2);
    });

    test("should not emit when disabled (native)", async () => {
      const wrapper = mount(Switch, {
        props: { useNative: true, isActive: false, isDisabled: true },
      });
      const input = wrapper.find('input[type="checkbox"]');
      (input.element as HTMLInputElement).checked = true;
      await input.trigger("change");
      expect(wrapper.emitted("update:is-active")).toBeUndefined();
    });

    test.todo("should not emit when disabled (custom)");
  });
});
