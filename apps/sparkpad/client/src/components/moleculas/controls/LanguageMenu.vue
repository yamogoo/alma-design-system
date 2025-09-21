<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useLocaleStore } from "@@/stores";

import { LOCALE_KEYS } from "@@/constants";
import type { Locale } from "@@/typings";

import { Dropdown } from "@/components/molecules";
import { Options } from "@/components/atoms";

const { currentLocale } = storeToRefs(useLocaleStore());
const { setLocale } = useLocaleStore();

const onSelectKey = (key: Locale) => {
  setLocale(key);
};
</script>

<template>
  <Dropdown
    class="language-menu"
    :size="'md'"
    :color="'primary'"
    :value="currentLocale.toUpperCase()"
    :close-on-option-click="true"
  >
    <Options
      :variant="'default'"
      :size="'md'"
      :mode="'primary'"
      :value="currentLocale"
      :items="LOCALE_KEYS"
      @select="onSelectKey"
    >
      <template #default="{ value }">
        {{ `${value}`.toUpperCase() }}
      </template>
    </Options>
  </Dropdown>
</template>

<style lang="scss">
.locale-dropdown {
  width: px2rem(76px);
}
</style>
