<script setup lang="ts">
import { storeToRefs } from "pinia";

import { Components, Stores } from "@alma/design-system";

import { AppHeader, AppFooter } from "@/components/organisms";

const { isConnected } = storeToRefs(Stores.useConnectionStore());
</script>

<template>
  <Components.Atoms.Page>
    <AppHeader></AppHeader>
    <RouterView></RouterView>
    <AppFooter></AppFooter>
    <Components.Moleculas.ActionSheet
      :is-active="!isConnected"
      :mode="'neutral'"
      :tone="'primary'"
    >
      <Components.Atoms.Text :variant="'caption-2'">
        {{ "Connection Lost" }}
      </Components.Atoms.Text>
    </Components.Moleculas.ActionSheet>
  </Components.Atoms.Page>
</template>
