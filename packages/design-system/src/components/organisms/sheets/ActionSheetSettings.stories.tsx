import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import StoryGrid from "@/stories/components/atoms/grids/StoryGrid.vue";
import StorySlotCover from "@/stories/components/molecules/covers/StorySlotCover.vue";

import type {
  ActionSheetSettingsMenuItems,
  ActionSheetSettingsProps,
} from "./ActionSheetSettings";
import ActionSheetSettings from "./ActionSheetSettings.vue";
import ActionButton from "@/components/molecules/buttons/aliases/ActionButton.vue";

const meta = {
  title: "Organisms/Sheets/ActionSheetSettings",
  component: ActionSheetSettings,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "ActionSheetSettingsTemplate is a composite layout that combines an ActionSheet container with a sidebar-based settings menu. It demonstrates how ActionSheet can host complex, multi-sectioned configuration panels within a modal surface.",
        story:
          "This story shows a two-pane settings template: the sidebar provides navigation between setting categories, while the main ActionSheet area displays contextual content for the selected item. It’s typically used for application preferences, editor panels, or contextual configuration flows.",
      },
    },
  },
  argTypes: {
    menuItems: {
      control: "object",
    },
    selectedItemIndexes: {
      control: "text",
    },
    isOpen: {
      control: "boolean",
    },
    containerId: {
      control: "text",
    },
  },
  args: {
    menuItems: {},
    selectedItemIndexes: null,
    isOpen: false,
    containerId: "body",
  },
} satisfies Meta<typeof ActionSheetSettings>;

export default meta;
type Story = StoryObj<typeof meta>;

const menuItems: ActionSheetSettingsMenuItems = {
  top: [
    {
      id: "appearance",
      label: "Appearance",
      iconName: "colorPalette",
      iconStyle: "outline",
      value: undefined,
    },
    {
      id: "workspace",
      label: "Workspace",
      iconName: "console",
      iconStyle: "outline",
      value: undefined,
    },
    {
      id: "system",
      label: "System",
      iconName: "cog",
      iconStyle: "outline",
      value: undefined,
    },
  ],
  bottom: [
    {
      id: "account",
      label: "Account",
      iconName: "userThumbnail",
      iconStyle: "outline",
      value: undefined,
    },
  ],
};

export const Playground: Story = {
  args: {
    containerId: "body",
    isOpen: false,

    selectedItemIndexes: menuItems.top[0].id,
  },
  render: (args: ActionSheetSettingsProps) => ({
    setup() {
      const localIsOpen = ref(args.isOpen);

      const onOpenSheet = (): void => {
        localIsOpen.value = !localIsOpen.value;
      };

      return () => (
        <>
          <StoryGrid columns={1} style={{ width: "100%", height: "360px" }}>
            <ActionButton
              variant="default"
              size="md"
              mode="neutral"
              tone="primary"
              label="open sheet"
              stretch="row"
              onRelease={onOpenSheet}
            ></ActionButton>
            <ActionSheetSettings
              {...args}
              v-model:is-open={localIsOpen.value}
              menuItems={menuItems}
            >
              <StorySlotCover style={{ height: "880px" }}></StorySlotCover>
            </ActionSheetSettings>
          </StoryGrid>
        </>
      );
    },
  }),
};
