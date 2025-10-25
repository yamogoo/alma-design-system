<script setup lang="ts">
import type { SectionHeaderProps } from "@/components/molecules/headers/SectionHeader";
import SectionHeader from "@/components/molecules/headers/SectionHeader.vue";

const props = withDefaults(defineProps<SectionHeaderProps>(), {
  as: "header",
  isCloseButtonShown: true,
});

const emit = defineEmits<{
  (e: "close"): void;
}>();

const onClose = (): void => {
  emit("close");
};
</script>

<template>
  <SectionHeader v-bind="props" @close="onClose"></SectionHeader>
</template>
