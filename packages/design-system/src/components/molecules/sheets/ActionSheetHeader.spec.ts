import { mount } from "@vue/test-utils";

import SectionHeader from "@/components/molecules/headers/SectionHeader.vue";
import type { SectionHeaderProps } from "@/components/molecules/headers/SectionHeader";

import ActionSheetHeader from "./ActionSheetHeader.vue";

describe("ActionSheetHeader", () => {
  const mountHeader = (props?: Partial<SectionHeaderProps>) => {
    return mount(ActionSheetHeader, {
      props: {
        title: "Action Sheet",
        ...props,
      },
    });
  };

  describe("render", () => {
    test("should forward props to SectionHeader", () => {
      const props: SectionHeaderProps = {
        title: "Modal Title",
        isCloseButtonShown: false,
        variant: "default",
        size: "md",
        mode: "neutral",
        tone: "primary",
      };

      const wrapper = mountHeader(props);
      const sectionHeader = wrapper.findComponent(SectionHeader);

      expect(sectionHeader.exists()).toBeTruthy();
      expect(sectionHeader.props()).toMatchObject({
        title: props.title,
        isCloseButtonShown: props.isCloseButtonShown,
      });
    });
  });

  describe("events", () => {
    test("should emit close when SectionHeader emits close", () => {
      const wrapper = mountHeader();
      const sectionHeader = wrapper.findComponent(SectionHeader);

      sectionHeader.vm.$emit("close");

      expect(wrapper.emitted("close")).toBeTruthy();
      expect(wrapper.emitted("close")?.length).toBe(1);
    });
  });
});
