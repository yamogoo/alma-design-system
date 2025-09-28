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
    <Components.Moleculas.Snackbar
      :mode="'neutral'"
      :tone="'inversed'"
      :title="'Notification'"
      :description="'Some message'"
    ></Components.Moleculas.Snackbar>
    <AppFooter></AppFooter>
    <Components.Atoms.ActionSheet :is-active="!isConnected" :mode="'primary'">
      <Components.Atoms.Text :variant="'caption-2'">
        {{ "Connection Lost" }}
      </Components.Atoms.Text>
    </Components.Atoms.ActionSheet>
  </Components.Atoms.Page>
</template>
