<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

import { useAuthStore, useLocaleStore } from "@@/stores";

import { Form } from "@/components/molecules";
import { ActionButton, Input, PasswordInput, Text } from "@/components/atoms";

withDefaults(defineProps<Props>(), {
  isError: false,
});

const emit = defineEmits<{
  (e: "update:is-error", isError: boolean): void;
}>();

const { $t } = storeToRefs(useLocaleStore());

const router = useRouter();

const { isLoggedIn, errors: loginError } = storeToRefs(useAuthStore());
const { login } = useAuthStore();

const MIN_PASSWORD_LENGTH =
  +import.meta.env.VITE__FORM_PASSWORD_MIN_LENGTH || 6;

const localEmail = ref("");
const localPassword = ref("");
const localRepeatedPassword = ref("");
const localIsPasswordMasked = ref(true);
const localIsRepeatedPasswordMasked = ref(true);

const validatePassword = (password: string) => {
  return password.length >= MIN_PASSWORD_LENGTH;
};

const isPasswordValid = computed(() => validatePassword(localPassword.value));

const isRepeatedPasswordValid = computed(() =>
  validatePassword(localRepeatedPassword.value)
);

const isValid = computed(
  () => isPasswordValid.value && isRepeatedPasswordValid.value
);

const isError = computed(() => {
  const value = !!loginError.value.general;
  emit("update:is-error", value);
  return value;
});

const onSubmit = async (): Promise<void> => {
  onLogin(localEmail.value, localPassword.value);
};

const onRedirectToEditor = (): void => {
  router.push("/editor");
};

const onRedirectIfLoggedIn = (): void => {
  if (isLoggedIn.value) onRedirectToEditor();
};

const onLogin = async (email: string, password: string): Promise<void> => {
  await login(email, password);
  onRedirectIfLoggedIn();
};

onMounted(() => {
  onRedirectIfLoggedIn();
});
</script>

<script lang="ts">
export interface Props {
  isError?: boolean; // ContentKeyTrigger
}
</script>

<template>
  <Form :color="'primary'" :aria-label="'Login'">
    <Input
      v-model:value="localEmail"
      :placeholder="$t.auth.signin.form.userName"
      :type="'text'"
      :is-error="isError"
    ></Input>
    <PasswordInput
      v-model:value="localPassword"
      v-model:masked="localIsPasswordMasked"
      :type="'password'"
      :placeholder="$t.auth.signin.form.password"
      :is-error="isError"
    ></PasswordInput>
    <PasswordInput
      v-model:value="localRepeatedPassword"
      v-model:masked="localIsRepeatedPasswordMasked"
      :type="'password'"
      :placeholder="$t.auth.signin.form.repeatPassword"
      :is-error="isError"
    ></PasswordInput>
    <Text :variant="'caption-2'" :mode="'neutral'" :tone="'secondary'">{{
      $t.auth.login.form.description
    }}</Text>
    <Text
      v-if="isError"
      :data-testid="'auth-form-error'"
      :variant="'caption-1'"
      :text-color="'error'"
      >{{ loginError }}</Text
    >
    <template #footer>
      <ActionButton
        :mode="'accent'"
        :tone="'primary'"
        :size="'md'"
        :stretch="'fill'"
        :label="$t.auth.signin.form.register"
        :is-disabled="!isValid"
        @press="onSubmit"
        @key.enter="onSubmit"
      ></ActionButton>
    </template>
  </Form>
</template>
