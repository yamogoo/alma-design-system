<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useLocaleStore } from "@/stores";

import { MainFooterTemplate, Text } from "@alma/design-system";

const { $t } = storeToRefs(useLocaleStore());
</script>

<template>
  <MainFooterTemplate
    :as="'footer'"
    :variant="'default'"
    :size="'md'"
    class="app-footer"
    :is-main-element="true"
  >
    <Text :variant="'label-1'" :mode="'neutral'" :tone="'secondary'">
      {{ $t.about.author }} | 2025
    </Text>
  </MainFooterTemplate>
</template>
