<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useLocaleStore } from "@/stores";

import { Components } from "@alma/design-system";

const { $t } = storeToRefs(useLocaleStore());
</script>

<template>
  <Components.Templates.MainFooterTemplate
    :as="'footer'"
    class="app-footer"
    :is-main-element="true"
  >
    <Components.Atoms.Text
      :variant="'caption-2'"
      :mode="'neutral'"
      :tone="'secondary'"
    >
      {{ $t.about.author }} | 2025
    </Components.Atoms.Text>
  </Components.Templates.MainFooterTemplate>
</template>
