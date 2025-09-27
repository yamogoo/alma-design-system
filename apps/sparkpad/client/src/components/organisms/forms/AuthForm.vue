<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";

import { useLocaleStore } from "@@/stores";

import tokens from "@/tokens";

import { CarouselStack, StepPaginationTabs } from "@/components/atoms";
import { FormWrapper } from "@/components/molecules";

import LoginForm from "./LoginForm.vue";
import SigninForm from "./SigninForm.vue";

const FORM_ANIMATION_DURATION = 0.35,
  FORM_VIEW_ANIMATION_DURATION = 0.5;

const { $t } = storeToRefs(useLocaleStore());

const selectedFormId = ref(0);
const isLoginError = ref(false);
const isSigninError = ref(false);

const formPaginationItems = computed(() => {
  return [
    { id: 0, label: $t.value.auth.login.form.title },
    { id: 1, label: $t.value.auth.signin.form.title },
  ];
});

const onUpdateSelectedFormId = (id: number): void => {
  selectedFormId.value = id;

  // if (selectedId === 1) {
  //   emit("update:email", localEmail.value);
  //   emit("update:password", localPassword.value);
  // }
};

const contentKey = computed(
  () => `${selectedFormId.value}${+isLoginError.value}${+isSigninError.value}`
);
</script>

<template>
  <FormWrapper
    class="auth-form"
    :color="'primary'"
    bordered
    :content-key="contentKey"
    :duration="FORM_ANIMATION_DURATION"
  >
    <template #header>
      <StepPaginationTabs
        :selected-item-id="selectedFormId"
        :items="formPaginationItems"
        @update:selected-item-id="onUpdateSelectedFormId"
      >
      </StepPaginationTabs>
    </template>
    <CarouselStack
      :selected-screen-id="selectedFormId"
      :screen-count="2"
      :orientation="'horizontal'"
      :direction="'forward'"
      :stretch="'auto'"
      :duration="FORM_VIEW_ANIMATION_DURATION"
      :gap="tokens.spacing.md.$value"
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
$max-width: 378px;

.auth-form {
  box-sizing: border-box;
  width: 100%;
  max-width: px2rem($max-width);
}
</style>
