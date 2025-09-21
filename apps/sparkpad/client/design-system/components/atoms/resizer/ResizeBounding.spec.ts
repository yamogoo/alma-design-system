import { describe, test, expect } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";

import { ResizeBounding } from "@/components/atoms";

const getResizeBounding = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find('[data-testid="resizer"]');
};

describe("ResizeBounding", () => {
  describe("elements", () => {
    test("should render ResizeBounding component", () => {
      const wrapper = mount(ResizeBounding);

      const component = getResizeBounding(wrapper);
      const isComponentExists = component.exists();

      expect(isComponentExists).toBeTruthy();
      expect(isComponentExists).toMatchInlineSnapshot(`true`);
    });
  });

  describe("slots", () => {
    test("should render default slot", () => {
      const expectedSlotValue = "Slot Content";
      const expectedSlot = `<div class="slot">${expectedSlotValue}</div>`;

      const wrapper = mount(ResizeBounding, {
        slots: {
          default: expectedSlot,
        },
      });

      const slot = wrapper.find(".slot");
      const isSlotExists = slot.exists();

      const slotValue = slot.text();

      expect(isSlotExists).toBeTruthy();
      expect(slotValue).toBe(expectedSlotValue);
      expect(slotValue).toMatchInlineSnapshot(`"Slot Content"`);
    });
  });
});
