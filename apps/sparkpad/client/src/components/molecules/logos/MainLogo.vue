<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useLocaleStore } from "@@/stores";

import { LogoWithDescriptor } from "@/components/atoms";

const { $t } = storeToRefs(useLocaleStore());
</script>

<template>
  <LogoWithDescriptor :name="$t.about.title"></LogoWithDescriptor>
</template>
