<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useLocaleStore } from "@/stores";

import { LogoWithDescriptor } from "@alma/design-system";

const { $t } = storeToRefs(useLocaleStore());
</script>

<template>
  <LogoWithDescriptor :name="$t.about.title"></LogoWithDescriptor>
</template>
