export const withMainContainer = (Story: any, context: any) => (
  <div class="storybook-main-container">
    <Story {...context.args} />
  </div>
);
