<script setup lang="tsx">
import { computed, Fragment, h, provide, ref, useSlots, watch } from "vue";

import {
  ListInjectionKey,
  type ListInjection,
  type ListProps,
  type ListSelectedItemIndex,
  type ListSelectedItemIndexes,
} from "./List";

import type { IListItem } from "./ListItem";
import ListItem from "./ListItem.vue";
import Group from "@/components/atoms/containers/Group.vue";

const PREFIX = "list";

const slots = useSlots();

const props = withDefaults(defineProps<ListProps>(), {
  as: "div",
  stretch: "fill",
  orientation: "vertical",
  isCurrentItemShown: false,
  isMultiple: false,
  isSelectable: true,
  isJoined: true,
});

const emit = defineEmits<{
  "update:selectedItemIndexes": ListSelectedItemIndexes;
  change: ListSelectedItemIndexes;
}>();

const rootTag = computed(
  () =>
    props.as ??
    (props.isSelectable ? "div" : props.items?.length ? "ul" : "div")
);

const localSelectedItemIndexes = ref<
  IListItem["id"] | IListItem["id"][] | null
>(props.selectedItemIndexes ?? (props.isMultiple ? [] : null));

const selectedItemIndexes = computed({
  get: () => {
    return props.selectedItemIndexes !== undefined
      ? (props.selectedItemIndexes ?? null)
      : localSelectedItemIndexes.value;
  },
  set: (value) => {
    // Update local state only when uncontrolled
    if (props.selectedItemIndexes === undefined)
      localSelectedItemIndexes.value = value;
  },
});
const commit = (
  val: ListSelectedItemIndex | ListSelectedItemIndex[] | null
) => {
  if (props.selectedItemIndexes === undefined) selectedItemIndexes.value = val;
  emit("update:selectedItemIndexes", val);
  emit("change", val);
};

const setSelectedItemIndexes = (id: ListSelectedItemIndex | null) => {
  if (!props.isSelectable) return;

  if (props.isMultiple) {
    const current = (selectedItemIndexes.value ??
      []) as ListSelectedItemIndex[];
    if (id == null) return commit([]);

    const next = current.includes(id)
      ? current.filter((v) => v !== id)
      : [...current, id];

    return commit(next);
  } else {
    const current = selectedItemIndexes.value as ListSelectedItemIndex | null;
    const next = current === id ? null : id;
    return commit(next);
  }
};

watch(
  () => props.selectedItemIndexes,
  (v) => {
    localSelectedItemIndexes.value = v ?? (props.isMultiple ? [] : null);
  }
);

const effectiveVariant = computed(() =>
  props.isJoined ? "content" : (props.variant ?? "default")
);

const isCurrentItemShown = computed(() => !!props.isCurrentItemShown);
const isSelectable = computed(() => !!props.isSelectable);
const isJoined = computed(() => !!props.isJoined);

provide<ListInjection>(ListInjectionKey, {
  selectedItemIndexes,
  setSelectedItemIndexes,
  isCurrentItemShown,
  isSelectable,
  isJoined,
});

const normalizedItems = computed<IListItem[] | null>(() => {
  if (!props.items) return null;

  const items = props.items;

  if (typeof items[0] === "string") {
    return (items as string[]).map((title, idx) => ({ id: idx, title }));
  }

  return items as IListItem[];
});

const renderWithSlot = () => {
  if (!normalizedItems.value) return null;

  const children = normalizedItems.value.map((item) => {
    const { id, title, description } = item;
    const onSelect = () => setSelectedItemIndexes(id);

    const vnodeFromSlot = slots.default?.({
      item,
      isSelected: Array.isArray(selectedItemIndexes.value)
        ? selectedItemIndexes.value.includes(id)
        : selectedItemIndexes.value === id,
      onSelect,
    });

    if (vnodeFromSlot && vnodeFromSlot.length) {
      return vnodeFromSlot;
    }
    return h(ListItem, {
      key: String(id),
      as: rootTag.value === "ul" ? "li" : "div",
      id,
      title,
      description,
    });
  });

  return h(Fragment, null, children);
};
</script>

<template>
  <Group
    :is="rootTag"
    :class="[
      PREFIX,
      `${PREFIX}_variant-${effectiveVariant}`,
      {
        [`${PREFIX}_size-${size}`]: !!size,
        [`${PREFIX}_mode-${mode}`]: !!mode,
        [`${PREFIX}_tone-${tone}`]: !!tone,
      },
    ]"
    :variant="effectiveVariant"
    :size="size"
    :mode="mode"
    :tone="tone"
    :direction="direction"
    :orientation="orientation"
    :stretch="stretch"
    :role="isSelectable ? 'listbox' : 'list'"
    :aria-multiselectable="isSelectable ? isMultiple : undefined"
  >
    <slot v-if="!normalizedItems" :selected-id="selectedItemIndexes"></slot>
    <template v-else>
      <component :is="'template'">
        <component :is="{ render: () => renderWithSlot() }" />
      </component>
    </template>
  </Group>
</template>

<style lang="scss">
$prefix: "list";

.#{$prefix} {
  margin: 0;
  padding: 0;

  /* @include defineSizes(); */
  /* @include defineThemes(); */

  &__option {
    list-style: none;
    cursor: pointer;
    @extend %base-transition;
  }
}
</style>
