<script setup lang="ts">
import FilesNavigator from "./FilesNavigator.vue";
</script>

<template>
  <div class="explorer">
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
