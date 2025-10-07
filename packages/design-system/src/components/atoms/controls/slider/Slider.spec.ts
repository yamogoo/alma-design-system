import { mount } from "@vue/test-utils";

import { type SliderProps } from "@/components/atoms/controls/slider/Slider";
import Slider from "@/components/atoms/controls/slider/Slider.vue";

enum Classes {
  ROOT_CLASS = "slider",
  VARIANT = `${Classes.ROOT_CLASS}_variant`,
  SIZE = `${Classes.ROOT_CLASS}_size`,
  MODE = `${Classes.ROOT_CLASS}_mode`,
  TONE = `${Classes.ROOT_CLASS}_tone`,
}

const REQIERED_PROPS: SliderProps = {
  value: 0,
  max: 0,
};

describe("Slider", () => {
  test("renders with default props and classes", () => {
    const props: SliderProps = {
      variant: "default",
      size: "md",
      mode: "accent",
      tone: "primary",
      value: 0,
      max: 0,
    };

    const wrapper = mount(Slider, { props });

    expect(wrapper.classes()).toContain(`${Classes.VARIANT}-${props.variant}`);
    expect(wrapper.classes()).toContain(`${Classes.SIZE}-${props.size}`);
    expect(wrapper.classes()).toContain(`${Classes.MODE}-${props.mode}`);
    expect(wrapper.classes()).toContain(`${Classes.TONE}-${props.tone}`);
    // initial hover state is false -> normal
    expect(wrapper.classes()).toContain("slider_state-normal");
  });

  test("applies disabled state class when isDisabled=true", () => {
    const wrapper = mount(Slider, {
      props: { ...REQIERED_PROPS, isDisabled: true },
    });
    expect(wrapper.classes()).toContain("slider_state-disabled");
  });

  test("knob exposes ARIA attributes bound to value/min/max", () => {
    const props: Partial<SliderProps> = { min: 0, max: 100, value: 25 };

    const wrapper = mount(Slider, { props: { ...REQIERED_PROPS, ...props } });

    const knob = wrapper.find('[role="slider"]');
    expect(knob.exists()).toBe(true);
    expect(knob.attributes("aria-valuemin")).toBe(String(props.min));
    expect(knob.attributes("aria-valuemax")).toBe(String(props.max));
    expect(knob.attributes("aria-valuenow")).toBe(String(props.value));
  });

  test("keyboard ArrowRight increases value by step and emits update", async () => {
    const props: Partial<SliderProps> = {
      min: 0,
      max: 100,
      step: 10,
      value: 0,
    };

    const wrapper = mount(Slider, { props: { ...REQIERED_PROPS, ...props } });
    const knob = wrapper.find('[role="slider"]');

    await knob.trigger("keydown", { key: "ArrowRight" });

    const events = wrapper.emitted("update:value");
    expect(events?.length).toBeGreaterThan(0);
    // first increment should be +step
    expect(events?.[0]).toEqual([10]);
  });
});
