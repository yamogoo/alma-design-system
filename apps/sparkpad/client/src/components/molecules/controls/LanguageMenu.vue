<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useLocaleStore } from "@/stores";

import { Constants } from "@/constants";
import type { Locale } from "@/typings";

import { Components } from "@alma/design-system";

const { currentLocale } = storeToRefs(useLocaleStore());
const { setLocale } = useLocaleStore();

const onSelectKey = (key: Locale) => {
  setLocale(key);
};
</script>

<template>
  <Components.Molecules.Dropdown
    class="language-menu"
    :size="'md'"
    :color="'primary'"
    :value="currentLocale.toUpperCase()"
    :close-on-option-click="true"
  >
    <Components.Atoms.Options
      :variant="'default'"
      :size="'md'"
      :mode="'neutral'"
      :tone="'primary'"
      :value="currentLocale"
      :items="Constants.LOCALE_KEYS"
      @select="onSelectKey"
    >
      <template #default="{ value }">
        {{ `${value}`.toUpperCase() }}
      </template>
    </Components.Atoms.Options>
  </Components.Molecules.Dropdown>
</template>

<style lang="scss">
.locale-dropdown {
  width: px2rem(76px);
}
</style>
