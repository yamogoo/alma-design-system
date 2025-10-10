import { mount } from "@vue/test-utils";

import { TOOLTIP_PREFIX } from "./Tooltip";
import Tooltip from "./Tooltip.vue";

const Classes = {
  ROOT_CLASS: TOOLTIP_PREFIX,
  VARIANT: `${TOOLTIP_PREFIX}_variant`,
  SIZE: `${TOOLTIP_PREFIX}_size`,
  MODE: `${TOOLTIP_PREFIX}_mode`,
  TONE: `${TOOLTIP_PREFIX}_tone`,
  ALIGN: `${TOOLTIP_PREFIX}_align`,
} as const;

vi.mock("gsap", () => ({
  default: {
    fromTo: vi.fn(
      (_el, _from: gsap.TweenVars, to: gsap.TweenVars) =>
        to?.onComplete && to.onComplete()
    ),
    to: vi.fn(
      (_el, opts: gsap.TweenVars) => opts?.onComplete && opts.onComplete()
    ),
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

    expect(wrapper.classes()).toContain(Classes.ROOT_CLASS);
    expect(wrapper.classes()).toContain(`${Classes.ALIGN}-center`);
    expect(wrapper.find("button").exists()).toBe(true);
  });

  test("applies align classes", () => {
    const wrapper = mount(Tooltip, {
      props: { label: "Align Test", align: "end" },
    });
    expect(wrapper.classes()).toContain(`${Classes.ALIGN}-end`);
  });
});
