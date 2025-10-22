<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";

import { useLocaleStore } from "@/stores";

import {
  StepPaginationTabs,
  CarouselStack,
  FormWrapper,
  Tokens,
} from "@alma/design-system";

import LoginForm from "./LoginForm.vue";
import SigninForm from "./SigninForm.vue";

const FORM_ANIMATION_DURATION = 0.35,
  FORM_VIEW_ANIMATION_DURATION = 0.5;

const { $t } = storeToRefs(useLocaleStore());

const selectedFormIndex = ref(0);
const isLoginError = ref(false);
const isSigninError = ref(false);

const formPaginationItems = computed(() => {
  return [
    { id: 0, label: $t.value.auth.login.form.title },
    { id: 1, label: $t.value.auth.signin.form.title },
  ];
});

const onUpdateSelectedFormIndex = (id: number): void => {
  selectedFormIndex.value = id;

  // if (selectedId === 1) {
  //   emit("update:email", localEmail.value);
  //   emit("update:password", localPassword.value);
  // }
};

const contentKey = computed(
  () =>
    `${selectedFormIndex.value}${+isLoginError.value}${+isSigninError.value}`
);
</script>

<template>
  <FormWrapper
    class="auth-form"
    variant="default"
    mode="neutral"
    tone="canvas"
    size="lg"
    :border="'hv'"
    :elevated="true"
    :content-key="contentKey"
    :duration="FORM_ANIMATION_DURATION"
  >
    <template #header>
      <StepPaginationTabs
        :size="'lg'"
        :selected-item-index="selectedFormIndex"
        :items="formPaginationItems"
        @update:selected-item-index="onUpdateSelectedFormIndex"
      >
      </StepPaginationTabs>
    </template>
    <CarouselStack
      :selected-screen-id="selectedFormIndex"
      :screen-count="2"
      :orientation="'horizontal'"
      :direction="'forward'"
      :stretch="'auto'"
      :duration="FORM_VIEW_ANIMATION_DURATION"
      :gap="Tokens.tokens.spacing.md.$value"
    >
      <template #screen-1="{ isActive }">
        <LoginForm
          v-show="isActive"
          v-model:is-error="isLoginError"
        ></LoginForm>
      </template>
      <template #screen-2="{ isActive }">
        <SigninForm
          v-show="isActive"
          v-model:is-error="isSigninError"
        ></SigninForm>
      </template>
    </CarouselStack>
  </FormWrapper>
</template>

<style lang="scss">
$max-width: 400px;

.auth-form {
  box-sizing: border-box;
  width: 100%;
  max-width: px2rem($max-width);
}
</style>
