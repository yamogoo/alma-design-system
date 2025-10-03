<script setup lang="ts">
import { ref } from "vue";

import { Components } from "@alma/design-system";

import FilesNavigator from "./FilesNavigator.vue";

const searchingPhrase = ref("");

const onResetValue = (): void => {
  console.log(searchingPhrase.value);
};
</script>

<template>
  <Components.Atoms.Surface
    class="explorer"
    :as="'div'"
    bordered
    :variant="'default'"
    :size="'lg'"
    :mode="'neutral'"
    :tone="'canvas'"
  >
    <Components.Atoms.SearchInput
      v-model.trim="searchingPhrase"
      placeholder="Search"
      size="lg"
      @reset:value="onResetValue"
    ></Components.Atoms.SearchInput>
    <FilesNavigator></FilesNavigator>
  </Components.Atoms.Surface>
</template>

<style lang="scss">
.explorer {
  box-sizing: border-box;
  position: relative;
  @include box(100%);
  border-radius: 32px;
  padding: 12px;
  @include surface("neutral", "primary");
  @include border("neutral", "primary");
  border-width: 1px;
  border-style: solid;
  @extend %base-transition;
}
</style>
