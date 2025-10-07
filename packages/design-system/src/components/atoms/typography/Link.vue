<script setup lang="ts">
import { useRouter } from "vue-router";

import { type LinkProps } from "@/components/atoms/typography/Link";
import Text from "@/components/atoms/typography/Text.vue";

const PREFIX = "link";

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
    :class="PREFIX"
    @pointerup="onClick"
  >
    <slot></slot>
  </Text>
</template>

<style lang="scss">
$prefix: link;

.#{$prefix} {
  cursor: pointer;
}
</style>
