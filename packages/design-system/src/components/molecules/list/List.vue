<script setup lang="tsx">
import { computed, provide, ref, watch } from "vue";

import {
  LIST_PREFIX,
  ListInjectionKey,
  type ListInjection,
  type ListProps,
  type ListSelectedItemIndex,
  type ListSelectedItemIndexes,
} from "./List";

import { type IListItem } from "@/components/atoms/list/ListItem";
import ListItem from "@/components/atoms/list/ListItem.vue";
import Group from "@/components/molecules/containers/Group.vue";

const props = withDefaults(defineProps<ListProps>(), {
  as: "div",
  variant: "default",
  size: "md",
  stretch: "row",
  orientation: "vertical",
  isCurrentItemShown: false,
  isMultiple: false,
  isSelectable: true,
  isClickable: false,
  isJoined: true,
});

const emit = defineEmits<{
  "update:selected-item-indexes": ListSelectedItemIndexes;
  change: ListSelectedItemIndexes;
}>();

const rootTag = computed(
  () =>
    props.as ??
    (props.isSelectable ? "div" : props.items?.length ? "ul" : "div")
);

const localSelectedItemIndexes = ref<
  ListSelectedItemIndex | ListSelectedItemIndex[] | null
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
  emit("update:selected-item-indexes", val);
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
const isClickable = computed(() => !!props.isClickable);
const isJoined = computed(() => !!props.isJoined);

provide<ListInjection>(ListInjectionKey, {
  selectedItemIndexes,
  setSelectedItemIndexes,
  isCurrentItemShown,
  isSelectable,
  isClickable,
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

const isSelectedById = (id: ListSelectedItemIndex) =>
  Array.isArray(selectedItemIndexes.value)
    ? selectedItemIndexes.value.includes(id)
    : selectedItemIndexes.value === id;

const asTagForItem = computed(() => (rootTag.value === "ul" ? "li" : "div"));

const onSelectById = (id: ListSelectedItemIndex) => () =>
  setSelectedItemIndexes(id);

/* * * Keyboard * * */

const focusIndex = ref(0);

const move = (dir: -1 | 1) => {
  if (!normalizedItems.value?.length) return;

  const len = normalizedItems.value.length;
  focusIndex.value = (focusIndex.value + dir + len) % len;
};

const onKeydown = (e: KeyboardEvent) => {
  if (!normalizedItems.value?.length) return;
  const idAt = (i: number) => normalizedItems.value![i].id;

  switch (e.key) {
    case "ArrowDown":
    case "ArrowRight":
      move(1);
      break;
    case "ArrowUp":
    case "ArrowLeft":
      move(-1);
      break;
    case "Home":
      focusIndex.value = 0;
      break;
    case "End":
      focusIndex.value = normalizedItems.value.length - 1;
      break;
    case "Enter":
    case " ":
      setSelectedItemIndexes(idAt(focusIndex.value));
      break;
  }
};
</script>

<template>
  <Group
    :is="rootTag"
    :class="LIST_PREFIX"
    :data-testid="LIST_PREFIX"
    :variant="effectiveVariant"
    :size="size"
    :mode="mode"
    :tone="tone"
    :direction="direction"
    :orientation="orientation"
    :align-vertical="alignVertical"
    :align-horizontal="alignHorizontal"
    :stretch="stretch"
    :role="isSelectable ? 'listbox' : 'list'"
    :aria-multiselectable="isSelectable ? isMultiple : undefined"
    @keydown.stop.prevent="onKeydown"
  >
    <slot v-if="!normalizedItems" :selected-id="selectedItemIndexes"></slot>
    <template v-else>
      <template v-for="(item, i) in normalizedItems" :key="item.id">
        <slot
          :item="item"
          :isSelected="isSelectedById(item.id)"
          :onSelect="onSelectById(item.id)"
          :isFocused="i === focusIndex"
        >
          <ListItem
            :as="asTagForItem"
            :id="item.id"
            :mode="'neutral'"
            :tone="'canvas'"
            :title="item.title"
            :description="item.description"
            :is-active="isSelectedById(item.id)"
            :is-focused="i === focusIndex"
            @click="onSelectById(item.id)"
          />
        </slot>
      </template>
    </template>
  </Group>
</template>

<style lang="scss">
$prefix: "list";

.#{$prefix} {
  margin: 0;
  padding: 0;

  &__option {
    list-style: none;
    cursor: pointer;
    @include useThemeTransition();
  }
}
</style>
