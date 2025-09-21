<script setup lang="ts">
import { Page, Text } from "@/components/atoms";

import {
  LandingHeader,
  LandingCover,
  LandingFooter,
} from "@lp/components/molecules";
</script>

<template>
  <Page>
    <LandingHeader></LandingHeader>
    <LandingCover>
      <Text :variant="'title-1'">Promo</Text>
    </LandingCover>
    <LandingFooter></LandingFooter>
  </Page>
</template>
