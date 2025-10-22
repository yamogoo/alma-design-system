<script setup lang="ts">
import type { MenuItemProps } from "./MenuItem";
import ListItem from "@/components/atoms/list/ListItem.vue";

const props = withDefaults(defineProps<MenuItemProps>(), {
  size: "md",
  iconWeight: "400",
  isClickable: false,
  isJoined: false,
});
</script>

<template>
  <ListItem :variant="'menu'" v-bind="props"> </ListItem>
</template>
