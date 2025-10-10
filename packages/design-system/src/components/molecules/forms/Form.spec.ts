import { mount, VueWrapper } from "@vue/test-utils";

import { UIFACETS } from "@/constants/ui";

import { FORM_PREFIX, type FormProps } from "./Form";
import Form from "@/components/molecules/forms/Form.vue";

const Classes = {
  ROOT_CLASS: FORM_PREFIX,
  SIZE: `${FORM_PREFIX}_${UIFACETS.SIZE}`,
};

const getBody = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`.${Classes.ROOT_CLASS}__body`);
};

const getFooter = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`.${Classes.ROOT_CLASS}__footer`);
};

vi.mock("vue", async (orig) => {
  const actual = await orig();
  return {
    ...(actual as object),
    useId: () => "mock-id",
  };
});

describe("Form", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("elements", () => {
    test("renders the footer slot if it exists", () => {
      const wrapper = mount(Form, {
        slots: { footer: "<div class='custom-footer'>Footer Content</div>" },
      });
      const footer = getFooter(wrapper);

      expect(footer.exists()).toBe(true);
      expect(footer.text()).toContain("Footer Content");
    });

    test("does not render footer if slot footer is empty", () => {
      const wrapper = mount(Form);

      expect(getFooter(wrapper).exists()).toBe(false);
    });
  });

  describe("classes", () => {
    test("adds class for size", () => {
      const props: FormProps = {
        size: "md",
      };

      const wrapper = mount(Form, {
        props,
      });

      expect(wrapper.classes(`${Classes.SIZE}-${props.size}`)).toBeTruthy();
    });
  });

  describe("values", () => {
    test("assigns an id to the form via useId", () => {
      const wrapper = mount(Form);

      expect(wrapper.attributes("id")).toBe("mock-id");
    });
  });

  describe("slots", () => {
    test("renders header slot", () => {
      const wrapper = mount(Form, {
        slots: { header: "<div class='custom-header'>Header Content</div>" },
      });

      expect(wrapper.find(".custom-header").exists()).toBeTruthy();
    });

    test("renders body slot always", () => {
      const wrapper = mount(Form, {
        slots: { default: "<p>Body content</p>" },
      });

      const body = getBody(wrapper);

      expect(body.exists()).toBe(true);
      expect(body.text()).toContain("Body content");
    });
  });
});
