import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { enumOptions } from "@/stories/utils";

import {
  snackbarModes,
  snackbarSizes,
  snackbarTones,
  snackbarVariants,
} from "@/adapters/molecules/snackbar";

import StoryGrid from "@/stories/components/atoms/grids/StoryGrid.vue";
import PageHeader from "@/stories/components/atoms/headers/PageHeader.vue";
import InfoBlock from "@/stories/components/atoms/blocks/InfoBlock.vue";

import type { SnackbarProps } from "./Snackbar";
import Snackbar from "./Snackbar.vue";

const meta = {
  title: "Molecules/Panels/Snackbar",
  component: Snackbar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **Snackbar** component displays brief messages to inform users about an event or action.  
It supports a **title** for a short summary and an optional **description** for additional context.  
Commonly used for non-blocking feedback, confirmations, or alerts.`,
        story: `
Use **title** to provide a concise message, and **description** for more detailed information.  
Example: “File uploaded” as title and “Your document has been successfully saved to the cloud” as description.`,
      },
    },
  },
  argTypes: {
    variant: enumOptions(snackbarVariants),
    size: enumOptions(snackbarSizes),
    mode: enumOptions(snackbarModes),
    tone: enumOptions(snackbarTones),
    title: {
      control: "text",
    },
    description: {
      control: "text",
    },
  },
  args: {
    variant: "default",
    size: "lg",
    mode: "neutral",
    tone: "primary",
  },
} satisfies Meta<typeof Snackbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    title: "Hello World",
    description: "Some description",
  },
  render: (args: SnackbarProps) => ({
    setup() {
      return () => (
        <>
          <StoryGrid columns={2}>
            <InfoBlock>
              <Snackbar
                {...args}
                mode={"neutral"}
                tone={"primary"}
                isCloseButtonShown={true}
              ></Snackbar>
            </InfoBlock>
          </StoryGrid>
        </>
      );
    },
  }),
};

export const Colors: Story = {
  args: {
    title: "Hello World",
    description: "Description",
  },
  render: (args: SnackbarProps) => ({
    setup() {
      return () => (
        <>
          <PageHeader
            title={"Snackbar color"}
            description={"Demonstrates mode and tone"}
          ></PageHeader>
          <StoryGrid columns={2}>
            {snackbarModes.map((mode) =>
              snackbarTones.map((tone) => (
                <InfoBlock>
                  <Snackbar
                    {...args}
                    mode={mode}
                    tone={tone}
                    isCloseButtonShown={true}
                  ></Snackbar>
                </InfoBlock>
              ))
            )}
          </StoryGrid>
        </>
      );
    },
  }),
};
