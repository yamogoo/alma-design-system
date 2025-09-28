<script setup lang="ts">
import { onUnmounted, useTemplateRef } from "vue";
import g from "gsap";

import { Composables, Components } from "@alma/design-system";

import { AuthForm } from "@/components/organisms";

const START_DELAY = 350;
const MESSAGE_DURATION_IN = 0.65;
const CONTAINER_DELAY = 0.45;
const CONTAINER_DURATION_IN = 0.45;
const FORM_DELAY = 0.5;
const FORM_DURATION_IN = 0.55;

const refContent = useTemplateRef<HTMLDivElement | null>("content");
const refMessage = useTemplateRef<HTMLDivElement | null>("message");
const refForm = useTemplateRef<HTMLDivElement | null>("form");

const containerToCenterOffset = (): number => {
  const height = refContent.value?.clientHeight ?? 0;
  const messageHeight = refMessage.value?.clientHeight ?? 0;

  const offset = (height - messageHeight) / 2;
  return offset;
};

/* * * Animations * * */

const messageAnimTimer = Composables.Local.useTimeout(() => {
  const el = refMessage.value;

  if (el) onAnimMessageEnter(el);
}, START_DELAY);

const onAnimContainerEnter = (el: Element): void => {
  g.to(el, {
    y: 0,
    ease: "power4.out",
    duration: CONTAINER_DURATION_IN,
    delay: CONTAINER_DELAY,
  });
};

const onAnimFormEnter = (el: Element): void => {
  const height = el.clientHeight / 3;

  g.fromTo(
    el,
    {
      y: height,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      ease: "power4.out",
      direction: FORM_DURATION_IN,
      delay: FORM_DELAY,
    }
  );
};

const onAnimMessageEnter = (el: Element): void => {
  g.fromTo(
    el,
    {
      scale: 0.85,
      opacity: 0,
    },
    {
      scale: 1,
      opacity: 1,
      ease: "power4.out",
      direction: MESSAGE_DURATION_IN,
      onComplete: () => {
        const form = refForm.value;
        const container = refContent.value;

        if (form) onAnimFormEnter(form);
        if (container) onAnimContainerEnter(container);
      },
    }
  );
};

const setContainerStartPosition = (): void => {
  const el = refContent.value;
  if (!el) return;

  g.set(el, {
    y: containerToCenterOffset(),
    duration: 0,
  });
};

const animInit = (): void => {
  if (!refForm.value || !refMessage.value) return;

  refForm.value!.style = "opacity: 0;";
  refMessage.value!.style = "opacity: 0;";

  setContainerStartPosition();
  messageAnimTimer.start();
};

const onPageAnimCompleted = (): void => {
  animInit();
};

onUnmounted(() => {
  messageAnimTimer.stop();
});
</script>

<template>
  <Components.Atoms.Page
    class="login"
    @anim-enter-completed="onPageAnimCompleted"
  >
    <div ref="content" class="login__content">
      <div ref="form" class="login__form-wrapper">
        <AuthForm></AuthForm>
      </div>
    </div>
  </Components.Atoms.Page>
</template>

<style lang="scss">
@use "sass:map";

.login {
  box-sizing: border-box;
  position: relative;
  align-content: center;
  @include box(100%);
  padding: get($spacing, "lg");
  overflow: hidden;

  /* &__content {} */

  .auth-form {
    margin: auto;
  }
}
</style>
