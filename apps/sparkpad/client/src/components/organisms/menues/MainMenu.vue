<script setup lang="ts">
import { ref } from "vue";

import { SimpleMenu, type MenuItems } from "@/components/atoms";

const selectedItemId = ref(0);

const items: MenuItems<string> = [
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
  <SimpleMenu :selected-item-id="selectedItemId" :items></SimpleMenu>
</template>
