<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useLocaleStore } from "@@/stores";

import { Text } from "@/components/atoms";
import { MainFooter } from "@/components/templates";

const { $t } = storeToRefs(useLocaleStore());
</script>

<template>
  <MainFooter :as="'footer'" class="app-footer" :is-main-element="true">
    <Text :variant="'caption-2'" :mode="'neutral'" :tone="'secondary'"
      >{{ $t.about.author }} | 2025</Text
    >
  </MainFooter>
</template>
