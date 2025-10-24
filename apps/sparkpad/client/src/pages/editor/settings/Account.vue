<script setup lang="ts">
import { List, ListItem } from "@alma/design-system";
</script>

<template>
  <List :is-selectable="false">
    <ListItem
      :id="'1'"
      mode="neutral"
      tone="canvas"
      :is-joined="true"
      :title="'Account'"
    >
    </ListItem>
  </List>
</template>
