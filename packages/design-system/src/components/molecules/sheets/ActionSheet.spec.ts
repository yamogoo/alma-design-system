import { nextTick } from "vue";
import { mount, VueWrapper } from "@vue/test-utils";

import { mountWithTeleport } from "@/__tests__/utils";

import { UIFACETS } from "@/constants/ui";

import { ACTION_SHEET_PREFIX, type ActionSheetProps } from "./ActionSheet";
import ActionSheet from "./ActionSheet.vue";

const Classes = {
  ROOT_CLASS: ACTION_SHEET_PREFIX,
  VARIANT: `${ACTION_SHEET_PREFIX}_${UIFACETS.VARIANT}`,
  SIZE: `${ACTION_SHEET_PREFIX}_${UIFACETS.SIZE}`,
} as const;

const getActionSheet = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`${Classes.ROOT_CLASS}`);
};

vi.mock("gsap", () => ({
  default: {
    killTweensOf: vi.fn(),
    fromTo: vi.fn(),
    to: vi.fn(),
  },
}));

describe("ActionSheet.vue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  mountWithTeleport();

  test("renders nothing when inactive initially", () => {
    const wrapper = mount(ActionSheet, {
      props: { containerId: "#app", isOpen: false },
    });

    expect(getActionSheet(wrapper).exists()).toBe(false);
  });

  test("applies size and color classes", async () => {
    const props: ActionSheetProps = {
      containerId: "#app",
      isOpen: false,
      variant: "default",
      size: "md",
      mode: "neutral",
      tone: "primary",
    };

    const wrapper = mount(ActionSheet, {
      props,
      attachTo: document.body,
    });

    await wrapper.setProps({ isOpen: true });
    await nextTick();
    await nextTick();

    const el = document.querySelector(`#app .${Classes.ROOT_CLASS}`);

    expect(el).not.toBeNull();
    expect(el!.classList.contains(`${Classes.VARIANT}-${props.variant}`)).toBe(
      true
    );
    expect(el!.classList.contains(`${Classes.SIZE}-${props.size}`)).toBe(true);
  });
});
