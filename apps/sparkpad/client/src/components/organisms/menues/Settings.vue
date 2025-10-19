<script setup lang="ts">
import { ref, watch } from "vue";

import type { SettingsProps } from "./Settings";

import { Components } from "@alma/design-system";

const props = defineProps<SettingsProps>();

const emit = defineEmits<{
  (e: "update:is-open", isOpen: boolean): void;
}>();

const localIsOpen = ref(props.isOpen);

watch(
  () => props.isOpen,
  (newValue) => {
    localIsOpen.value = newValue;
  }
);

watch(localIsOpen, (newValue) => {
  emit("update:is-open", newValue);
});
</script>

<template>
  <Components.Molecules.ActionSheet
    v-model:is-open="localIsOpen"
    mode="neutral"
    tone="primary"
    orientation="vertical"
  >
    <Components.Atoms.Text variant="body-2" mode="neutral" tone="primary">
      {{ "Settings" }}
    </Components.Atoms.Text>
  </Components.Molecules.ActionSheet>
</template>
