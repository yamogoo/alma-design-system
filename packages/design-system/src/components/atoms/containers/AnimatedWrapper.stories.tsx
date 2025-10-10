import { computed, ref, type ComputedRef, type CSSProperties } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import StoryGrid from "@/stories/components/atoms/grids/StoryGrid.vue";
import StorySlotCover from "@/stories/components/molecules/covers/StorySlotCover.vue";

import { type AnimatedWrapperProps } from "./AnimatedWrapper";
import AnimatedWrapper from "./AnimatedWrapper.vue";
import Text from "@/components/atoms/typography/Text.vue";
import ActionButton from "@/components/molecules/buttons/aliases/ActionButton.vue";

const meta = {
  title: "Atoms/Containers/AnimatedWrapper",
  component: AnimatedWrapper,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "ResizeBounding is a lightweight Vue 3 wrapper around **vue3-resize-bounding**, providing draggable split panes and resizable containers with an intuitive API.",
        story:
          "Interactive playground to explore resizing behavior, directional constraints, and container nesting.",
      },
    },
  },
  argTypes: {},
  args: {},
} satisfies Meta<typeof AnimatedWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    contentKey: "1",
    duration: 0.5,
  },
  render: (args: AnimatedWrapperProps) => ({
    setup() {
      const isPressed = ref(false);
      const title = ref("");

      const computedHeight: ComputedRef<CSSProperties> = computed(() => {
        const HEIGHT_IN = 320,
          HEIGHT_OUT = 240;

        title.value = !isPressed.value ? `${HEIGHT_IN}px` : `${HEIGHT_OUT}px`;
        return {
          height: isPressed.value ? `${HEIGHT_IN}px` : `${HEIGHT_OUT}px`,
        };
      });

      const onClick = (): void => {
        isPressed.value = !isPressed.value;
      };
      return () => (
        <>
          <StoryGrid columns={1}>
            <AnimatedWrapper {...args} contentKey={`${isPressed.value}`}>
              <StorySlotCover style={computedHeight.value}>
                <Text variant={"body-2"} mode={"accent"} tone={"primary"}>
                  Content height: {title.value}
                </Text>
                <ActionButton
                  variant={"default"}
                  size={"md"}
                  mode={"accent"}
                  tone={"primary"}
                  label={`Change height`}
                  onRelease={onClick}
                ></ActionButton>
              </StorySlotCover>
            </AnimatedWrapper>
          </StoryGrid>
        </>
      );
    },
  }),
};
