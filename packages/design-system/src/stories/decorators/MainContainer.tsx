import { defineComponent } from "vue";

export default defineComponent({
  name: "MainContainer",
  setup(_, { slots }) {
    return () => (
      <div class="storybook-main-container">{slots.default?.()}</div>
    );
  },
});
