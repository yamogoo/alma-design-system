<script setup lang="ts">
import { ref } from "vue";

import { SimpleMenu, type SimpleMenuItems } from "@alma/design-system";

const selectedItemIndex = ref(0);

const items: SimpleMenuItems<string> = [
  {
    id: 0,
    label: "about",
    value: "about",
  },
  {
    id: 1,
    label: "documentation",
    value: "documentation",
  },
];
</script>

<template>
  <SimpleMenu :selected-item-index="selectedItemIndex" :items></SimpleMenu>
</template>
