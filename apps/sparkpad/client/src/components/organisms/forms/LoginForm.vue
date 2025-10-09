<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

import { useAuthStore, useLocaleStore } from "@/stores";

import { Components } from "@alma/design-system";

const MIN_PASSWORD_LENGTH =
  +import.meta.env.VITE__FORM_PASSWORD_MIN_LENGTH || 6;

withDefaults(defineProps<Props>(), {
  isLoginError: false,
});

const emit = defineEmits<{
  (e: "update:is-error", isLoginError: boolean): void;
}>();

const { $t } = storeToRefs(useLocaleStore());

const router = useRouter();

const { isLoggedIn, errors } = storeToRefs(useAuthStore());
const { login } = useAuthStore();

const localEmail = ref("");
const localPassword = ref("");
const localIsPasswordMasked = ref(true);

const emailError = computed(() => {
  if (localEmail.value.length === 0) return null;
  if (!localEmail.value) return "Email is required";
  return null;
});

const passwordError = computed(() => {
  if (localPassword.value.length === 0) return null;
  if (!localPassword.value) return "Password is required";
  if (localPassword.value.length < MIN_PASSWORD_LENGTH)
    return "Password too short";
  return null;
});

const errorMessage = computed(() => {
  return passwordError.value || emailError.value || errors.value.general;
});

watch(errorMessage, (val) => {
  emit("update:is-error", !!val);
});

const isValid = computed(() => !emailError.value && !passwordError.value);

const onSubmit = async () => {
  if (!isValid.value) return;
  await onLogin(localEmail.value, localPassword.value);
};

const onContinueAsGuest = (): void => {
  onRedirectToEditor();
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
  isLoginError?: boolean; // ContentKeyTrigger
}
</script>

<template>
  <Components.Molecules.Form
    variant="default"
    :size="'md'"
    :mode="'neutral'"
    :tone="'primary'"
    :aria-label="'Signin'"
  >
    <Components.Molecules.TextInput
      v-model:value="localEmail"
      :placeholder="$t.auth.login.form.userName"
      :type="'text'"
      :is-error="!!emailError"
      :error-message="emailError"
    ></Components.Molecules.TextInput>
    <Components.Molecules.PasswordInput
      v-model:value="localPassword"
      v-model:masked="localIsPasswordMasked"
      :type="'password'"
      :placeholder="$t.auth.login.form.password"
      :is-error="!!passwordError"
      :error-message="passwordError"
    ></Components.Molecules.PasswordInput>
    <Components.Atoms.Text
      :variant="'label-1'"
      :mode="'neutral'"
      :tone="'secondary'"
    >
      {{ $t.auth.login.form.description }}
    </Components.Atoms.Text>

    <template #footer>
      <Components.Molecules.Group
        :orientation="'vertical'"
        :size="'sm'"
        :stretch="'fill'"
      >
        <Components.Molecules.ActionButton
          :mode="'accent'"
          :tone="'tertiary'"
          :size="'md'"
          :stretch="'fill'"
          :label="$t.auth.login.form.login"
          :is-disabled="!isValid"
          @press="onSubmit"
          @key.enter="onSubmit"
        >
        </Components.Molecules.ActionButton>
        <Components.Atoms.Divider
          :orientation="'horizontal'"
          :size="'md'"
          :mode="'neutral'"
          :tone="'primary'"
        ></Components.Atoms.Divider>
        <Components.Molecules.ActionButton
          :mode="'neutral'"
          :tone="'primary'"
          :size="'md'"
          :stretch="'fill'"
          :label="$t.auth.login.form.skip"
          @press="onContinueAsGuest"
        ></Components.Molecules.ActionButton>
      </Components.Molecules.Group>
    </template>
  </Components.Molecules.Form>
</template>
