import { mount } from "@vue/test-utils";

import Tooltip from "./Tooltip.vue";

vi.mock("gsap", () => ({
  default: {
    fromTo: vi.fn((_el, _from, to) => to?.onComplete && to.onComplete()),
    to: vi.fn((_el, opts) => opts?.onComplete && opts.onComplete()),
  },
}));

describe("Tooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  test("renders with default props and slot", () => {
    const wrapper = mount(Tooltip, {
      props: { label: "Tooltip Label" },
      slots: { default: "<button>Trigger</button>" },
    });

    expect(wrapper.classes()).toContain("tooltip");
    expect(wrapper.classes()).toContain("tooltip_align-center");
    expect(wrapper.find("button").exists()).toBe(true);
  });

  test("applies align classes", () => {
    const wrapper = mount(Tooltip, {
      props: { label: "Align Test", align: "end" },
    });
    expect(wrapper.classes()).toContain("tooltip_align-end");
  });
});
