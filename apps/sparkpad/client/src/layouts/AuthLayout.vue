<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useConnectionStore } from "@@/stores";

import { Page, ActionSheet, Text } from "@/components/atoms";
import { Snackbar } from "@/components/molecules";
import { AppHeader, AppFooter } from "@@/components/organisms";

const { isConnected } = storeToRefs(useConnectionStore());
</script>

<template>
  <Page>
    <AppHeader></AppHeader>
    <RouterView></RouterView>
    <Snackbar
      :tone="'neutral'"
      :mode="'inversed'"
      :title="'Notification'"
      :description="'Some message'"
    ></Snackbar>
    <AppFooter></AppFooter>
    <ActionSheet :is-active="!isConnected" :mode="'primary'">
      <Text :variant="'caption-2'"> Connection Lost</Text>
    </ActionSheet>
  </Page>
</template>
