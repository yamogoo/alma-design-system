<script setup lang="ts">
import { SPACER_PREFIX, type SpacerProps } from "./Spacer";

withDefaults(defineProps<SpacerProps>(), {
  as: "div",
});
</script>

<template>
  <component :is="as" :class="[SPACER_PREFIX]"></component>
</template>

<style lang="scss">
$tokenName: "spacer";
$prefix: getPrefix("spacer");

.#{$prefix} {
  @include box(100%);
}
</style>
