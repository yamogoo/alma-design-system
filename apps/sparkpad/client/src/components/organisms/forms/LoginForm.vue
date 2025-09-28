<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

import { useAuthStore, useLocaleStore } from "@/stores";

import { Components } from "@alma/design-system";

withDefaults(defineProps<Props>(), {
  isLoginError: false,
});

const emit = defineEmits<{
  (e: "update:is-error", isLoginError: boolean): void;
}>();

const { $t } = storeToRefs(useLocaleStore());

const router = useRouter();

const { isLoggedIn, errors, isLoading } = storeToRefs(useAuthStore());
const { login } = useAuthStore();

const MIN_PASSWORD_LENGTH =
  +import.meta.env.VITE__FORM_PASSWORD_MIN_LENGTH || 6;

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
  isLoginError?: boolean; // ContentKeyTrigger
}
</script>

<template>
  <Components.Moleculas.Form
    variant="default"
    :size="'md'"
    :mode="'neutral'"
    :tone="'primary'"
    :aria-label="'Signin'"
  >
    <Components.Atoms.Input
      v-model:value="localEmail"
      :placeholder="$t.auth.login.form.userName"
      :type="'text'"
      :is-error="!!emailError"
      :error-message="emailError"
    ></Components.Atoms.Input>
    <Components.Atoms.PasswordInput
      v-model:value="localPassword"
      v-model:masked="localIsPasswordMasked"
      :type="'password'"
      :placeholder="$t.auth.login.form.password"
      :is-error="!!passwordError"
      :error-message="passwordError"
    ></Components.Atoms.PasswordInput>
    <Components.Atoms.Text
      :variant="'caption-2'"
      :mode="'neutral'"
      :tone="'secondary'"
    >
      {{ $t.auth.login.form.description }}
    </Components.Atoms.Text>

    <template #footer>
      <Components.Atoms.Group
        :orientation="'vertical'"
        :size="'sm'"
        :stretch="'fill'"
      >
        <Components.Atoms.ActionButton
          :mode="'accent'"
          :tone="'primary'"
          :size="'md'"
          :stretch="'fill'"
          :label="$t.auth.login.form.login"
          :is-disabled="!isValid || isLoading"
          @press="onSubmit"
          @key.enter="onSubmit"
        >
        </Components.Atoms.ActionButton>
        <Components.Atoms.Divider
          :orientation="'horizontal'"
          :size="'md'"
          :mode="'neutral'"
          :tone="'secondary'"
        ></Components.Atoms.Divider>
        <Components.Atoms.Tooltip :label="'Button'">
          <Components.Atoms.ActionButton
            :mode="'neutral'"
            :tone="'tertiary'"
            :size="'md'"
            :stretch="'fill'"
            :label="$t.auth.login.form.skip"
            @press="onContinueAsGuest"
          ></Components.Atoms.ActionButton>
        </Components.Atoms.Tooltip>
      </Components.Atoms.Group>
    </template>
  </Components.Moleculas.Form>
</template>
