import { mount, VueWrapper } from "@vue/test-utils";

import {
  CHAR_TOOLTIP_PREFIX,
  type CharTooltipLabelProps,
} from "@/components/atoms/tooltips/CharTooltipLabel";
import CharTooltipLabel from "@/components/atoms/tooltips/CharTooltipLabel.vue";

const getIcon = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find('[data-testid="icon"]');
};

const Classes = {
  ROOT_CLASS: CHAR_TOOLTIP_PREFIX,
  VARIANT: `${CHAR_TOOLTIP_PREFIX}_variant`,
  SIZE: `${CHAR_TOOLTIP_PREFIX}_size`,
  MODE: `${CHAR_TOOLTIP_PREFIX}_mode`,
  TONE: `${CHAR_TOOLTIP_PREFIX}_tone`,
} as const;

describe("CharTooltipLabel", () => {
  test("renders with default props", () => {
    const props: CharTooltipLabelProps = {
      variant: "default",
      size: "lg",
      mode: "neutral",
      tone: "primary",
    };

    const wrapper = mount(CharTooltipLabel, {
      props: {
        label: "Hello",
        ...props,
      },
    });

    expect(wrapper.classes()).toContain(`${Classes.VARIANT}-${props.variant}`);
    expect(wrapper.classes()).toContain(`${Classes.SIZE}-${props.size}`);
    expect(wrapper.classes()).toContain(`${Classes.TONE}-${props.tone}`);
    expect(wrapper.classes()).toContain(`${Classes.MODE}-${props.mode}`);
    expect(wrapper.text()).toContain("Hello");
  });

  test("applies custom variant, size and color", () => {
    const props: CharTooltipLabelProps = {
      variant: "default",
      size: "lg",
      mode: "neutral",
      tone: "primary",
    };

    const wrapper = mount(CharTooltipLabel, {
      props: {
        label: "Custom",
        ...props,
      },
    });

    expect(wrapper.classes()).toContain(`${Classes.VARIANT}-${props.variant}`);
    expect(wrapper.classes()).toContain(`${Classes.SIZE}-${props.size}`);
    expect(wrapper.classes()).toContain(`${Classes.TONE}-${props.tone}`);
    expect(wrapper.classes()).toContain(`${Classes.MODE}-${props.mode}`);
  });

  test("renders the text label", () => {
    const wrapper = mount(CharTooltipLabel, {
      props: { label: "Tooltip Text" },
    });

    const label = wrapper.find(`div.${Classes.ROOT_CLASS}`).text();

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
