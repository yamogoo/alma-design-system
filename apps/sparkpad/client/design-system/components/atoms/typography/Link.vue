<script setup lang="ts">
import { useRouter } from "vue-router";

import { Text, type LinkProps } from "@/components/atoms";

const props = withDefaults(defineProps<LinkProps>(), {
  textDecoration: "underline",
});

const router = useRouter();

const onClick = (e: PointerEvent): void => {
  e.preventDefault();

  if (props.to) {
    router.push({ path: props.to as string });
  }
};
</script>

<template>
  <Text
    v-bind="props"
    :as="'a'"
    :href="href ?? to"
    class="link"
    @pointerup="onClick"
  >
    <slot></slot>
  </Text>
</template>

<style lang="scss">
@use "sass:map";

.link {
  cursor: pointer;
}
</style>
