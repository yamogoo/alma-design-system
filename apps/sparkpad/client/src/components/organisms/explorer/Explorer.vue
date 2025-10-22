<script setup lang="ts">
import { ref } from "vue";

import { Surface, SearchInput } from "@alma/design-system";

import FilesNavigator from "./FilesNavigator.vue";

const searchingPhrase = ref("");

const onResetValue = (): void => {
  console.log(searchingPhrase.value);
};
</script>

<template>
  <Surface
    class="explorer"
    as="div"
    variant="default"
    size="lg"
    mode="neutral"
    tone="canvas"
    orientation="vertical"
    direction="forward"
    :border="'hv'"
    rounded
  >
    <SearchInput
      v-model.trim="searchingPhrase"
      placeholder="Search"
      size="lg"
      @reset:value="onResetValue"
    ></SearchInput>
    <FilesNavigator></FilesNavigator>
  </Surface>
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
  @include useThemeTransition();
}
</style>
