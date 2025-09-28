<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useLocaleStore } from "@/stores";

import { Components } from "@alma/design-system";

const { $t } = storeToRefs(useLocaleStore());
</script>

<template>
  <Components.Atoms.LogoWithDescriptor
    :name="$t.about.title"
  ></Components.Atoms.LogoWithDescriptor>
</template>
