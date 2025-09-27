<script setup lang="ts">
import { ref } from "vue";

import { SearchInput } from "@/components/atoms";

import FilesNavigator from "./FilesNavigator.vue";

const searchingPhrase = ref("");

const onResetValue = (): void => {
  console.log(searchingPhrase.value);
};
</script>

<template>
  <div class="explorer">
    <SearchInput
      v-model.trim="searchingPhrase"
      placeholder="Search"
      size="lg"
      @reset:value="onResetValue"
    ></SearchInput>
    <FilesNavigator></FilesNavigator>
  </div>
</template>

<style lang="scss">
.explorer {
  box-sizing: border-box;
  position: relative;
  @include box(100%);
  background-color: white;
  border-radius: 32px;
  padding: 12px;
}
</style>
