import { nextTick } from "vue";
import { mount, VueWrapper } from "@vue/test-utils";

import { Input, type InputProps } from "@/components/atoms";

const REQUIRED_PROPS: InputProps = {
  value: "some-value",
};

const getResetButton = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find('[data-testid="input__field-reset-button"]');
};

const getPlaceholder = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(".input__field-placeholder");
};

const getErrorMessage = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(".input__error-message");
};

vi.mock("gsap", () => ({
  default: {
    to: vi.fn(),
    fromTo: vi.fn(),
  },
}));

vi.mock("@vueuse/core", () => ({
  useFocus: () => ({ focused: { value: false } }),
}));

describe("input", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders placeholder if passed", () => {
    const placeholderContent = "Some Placeholder";

    const wrapper = mount(Input, {
      props: { ...REQUIRED_PROPS, placeholder: placeholderContent },
    });

    const placeholder = getPlaceholder(wrapper);

    expect(placeholder.exists()).toBe(true);
    expect(placeholder.text()).toBe(placeholderContent);
  });

  test("does not render placeholder if not passed", () => {
    const wrapper = mount(Input, { props: REQUIRED_PROPS });

    const placeholder = getPlaceholder(wrapper);

    expect(placeholder.exists()).toBe(false);
  });

  test("displays a reset button if value is not empty", async () => {
    const wrapper = mount(Input, {
      props: { ...REQUIRED_PROPS, placeholder: "Some Placeholder" },
    });

    expect(getResetButton(wrapper).exists()).toBe(true);

    await wrapper.setProps({ value: "" });
    expect(getResetButton(wrapper).exists()).toBe(false);
  });

  test("emits update:value when text changes", async () => {
    const wrapper = mount(Input, {
      props: REQUIRED_PROPS,
    });

    const input = wrapper.find('[data-testid="input-value"]');
    await input.setValue("new text");

    expect(wrapper.emitted("update:value")).toBeTruthy();
    expect(wrapper.emitted("update:value")?.[0]).toEqual(["new text"]);
  });

  test("resets value when clicking reset and emits events", async () => {
    const wrapper = mount(Input, {
      props: { ...REQUIRED_PROPS, placeholder: "Test" },
    });

    const button = getResetButton(wrapper);
    await button.trigger("click");

    expect(wrapper.emitted("reset:value")).toBeTruthy();
    expect(wrapper.emitted("update:value")).toContainEqual([""]);
  });

  test("add class input_focused on focus", async () => {
    const wrapper = mount(Input, {
      props: { ...REQUIRED_PROPS, placeholder: "Test" },
    });

    await wrapper.trigger("pointerdown");
    expect(wrapper.classes()).toContain("input_state-focused");
  });

  test("should shows error message", async () => {
    const wrapper = mount(Input, {
      props: {
        ...REQUIRED_PROPS,
        errorMessage: "Error",
        isError: true,
      },
    });

    await nextTick();

    const errorMessage = getErrorMessage(wrapper);
    const errorMessageText = errorMessage.text();

    expect(errorMessageText).toMatchInlineSnapshot(`"error"`);
  });
});
