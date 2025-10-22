<script setup lang="ts">
import {
  Page,
  ActionSheet,
  Text,
  useConnectionStore,
} from "@alma/design-system";

import { AppHeader, AppFooter } from "@/components/organisms";

const connectionStore = useConnectionStore();
const { isConnected } = connectionStore;
</script>

<template>
  <Page>
    <AppHeader></AppHeader>
    <RouterView></RouterView>
    <AppFooter></AppFooter>
    <ActionSheet :is-open="!isConnected" :mode="'neutral'" :tone="'primary'">
      <Text :variant="'caption-1'">
        {{ "Connection Lost" }}
      </Text>
    </ActionSheet>
  </Page>
</template>
