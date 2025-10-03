<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

import { useAuthStore, useLocaleStore } from "@/stores";

import { Components } from "@alma/design-system";

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

const localIsError = computed(() => {
  const value = !!loginError.value.general;

  emit("update:is-error", value);
  return value;
});

const onSubmit = (): void => {
  void onLogin(localEmail.value, localPassword.value);
};

const onRedirectToEditor = (): void => {
  void router.push("/editor");
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
  <Components.Moleculas.Form
    variant="default"
    :size="'md'"
    :mode="'neutral'"
    :tone="'primary'"
    :aria-label="'Login'"
  >
    <Components.Atoms.Input
      v-model:value="localEmail"
      :placeholder="$t.auth.signin.form.userName"
      :type="'text'"
      :is-error="localIsError"
    ></Components.Atoms.Input>
    <Components.Atoms.PasswordInput
      v-model:value="localPassword"
      v-model:masked="localIsPasswordMasked"
      :type="'password'"
      :placeholder="$t.auth.signin.form.password"
      :is-error="localIsError"
    ></Components.Atoms.PasswordInput>
    <Components.Atoms.PasswordInput
      v-model:value="localRepeatedPassword"
      v-model:masked="localIsRepeatedPasswordMasked"
      :type="'password'"
      :placeholder="$t.auth.signin.form.repeatPassword"
      :is-error="localIsError"
    ></Components.Atoms.PasswordInput>
    <Components.Atoms.Text
      :variant="'caption-2'"
      :mode="'neutral'"
      :tone="'secondary'"
    >
      {{ $t.auth.login.form.description }}
    </Components.Atoms.Text>
    <Components.Atoms.Text
      v-if="localIsError"
      :data-testid="'auth-form-error'"
      :variant="'caption-1'"
      :text-color="'error'"
    >
      {{ loginError }}
    </Components.Atoms.Text>
    <template #footer>
      <Components.Atoms.ActionButton
        :mode="'accent'"
        :tone="'tertiary'"
        :size="'md'"
        :stretch="'fill'"
        :label="$t.auth.signin.form.register"
        :is-disabled="!isValid"
        @press="onSubmit"
        @key.enter="onSubmit"
      ></Components.Atoms.ActionButton>
    </template>
  </Components.Moleculas.Form>
</template>
