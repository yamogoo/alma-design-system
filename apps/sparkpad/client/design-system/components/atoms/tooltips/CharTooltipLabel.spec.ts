import { mount, VueWrapper } from "@vue/test-utils";

import CharTooltipLabel from "./CharTooltipLabel.vue";

const getIcon = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find('[data-testid="icon"]');
};

describe("CharTooltipLabel", () => {
  test("renders with default props", () => {
    const wrapper = mount(CharTooltipLabel, {
      props: {
        label: "Hello",
        variant: "default",
        size: "lg",
        mode: "primary",
      },
    });

    expect(wrapper.classes()).toContain("char-tooltip-label");
    expect(wrapper.classes()).toContain("char-tooltip-label_variant-default");
    expect(wrapper.classes()).toContain("char-tooltip-label_size-lg");
    expect(wrapper.classes()).toContain("char-tooltip-label_mode-primary");
    expect(wrapper.text()).toContain("Hello");
  });

  test("applies custom variant, size and color", () => {
    const wrapper = mount(CharTooltipLabel, {
      props: {
        label: "Custom",
        variant: "default",
        size: "lg",
        mode: "primary",
      },
    });

    expect(wrapper.classes()).toContain("char-tooltip-label_variant-default");
    expect(wrapper.classes()).toContain("char-tooltip-label_size-lg");
    expect(wrapper.classes()).toContain("char-tooltip-label_mode-primary");
  });

  test("renders the text label", () => {
    const wrapper = mount(CharTooltipLabel, {
      props: { label: "Tooltip Text" },
    });

    const label = wrapper.find("div.char-tooltip-label").text();

    expect(label).toContain("Tooltip Text");
  });

  test("renders an icon when iconName is provided", () => {
    const wrapper = mount(CharTooltipLabel, {
      props: { label: "With Icon", iconName: "cross" },
    });

    const iconEl = getIcon(wrapper);
    const isIconExists = iconEl.exists();

    expect(isIconExists).toBeTruthy();
  });

  test("does not render an icon when iconName is not provided", () => {
    const wrapper = mount(CharTooltipLabel, {
      props: { label: "No Icon" },
    });

    const iconEl = getIcon(wrapper);
    const isIconExists = iconEl.exists();

    expect(isIconExists).toBeFalsy();
  });

  test("passes iconStyle and iconWeight to the Icon component", () => {
    const wrapper = mount(CharTooltipLabel, {
      props: {
        label: "Styled Icon",
        iconName: "cross",
        iconStyle: "outline",
        iconWeight: "300",
      },
    });

    const icon = wrapper.findComponent({ name: "Icon" });
    expect(icon.props("appearance")).toBe("outline");
    expect(icon.props("weight")).toBe("300");
  });
});
