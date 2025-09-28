<script setup lang="ts">
import { ref } from "vue";

import { Components } from "@alma/design-system";

const selectedItemId = ref(0);

const items: Components.Atoms.MenuItems<string> = [
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
  <Components.Atoms.SimpleMenu
    :selected-item-id="selectedItemId"
    :items
  ></Components.Atoms.SimpleMenu>
</template>
