<script setup lang="tsx">
import { computed, provide, ref, watch } from "vue";

import {
  LIST_PREFIX,
  ListInjectionKey,
  type ListInjection,
  type ListProps,
  type ListSelectedItemIndex,
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
  isRadioButton: false,
  isClickable: false,
  isJoined: true,
});

const emit = defineEmits<{
  (
    e: "update:selected-item-indexes",
    selectedItemIndexes: ListSelectedItemIndex | ListSelectedItemIndex[] | null
  ): void;
  (
    e: "change",
    selectedItemIndexes: ListSelectedItemIndex | ListSelectedItemIndex[] | null
  ): void;
}>();

const rootTag = computed(
  () =>
    props.as ??
    (props.isSelectable ? "div" : props.items?.length ? "ul" : "div")
);

const selectedItemIndexes = computed({
  get: () =>
    props.selectedItemIndexes !== undefined
      ? (props.selectedItemIndexes ?? null)
      : localSelectedItemIndexes.value,
  set: (value) => {
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
  if (!isSelectable.value) return;

  if (isMultipleEffective.value) {
    const current = (selectedItemIndexes.value ??
      []) as ListSelectedItemIndex[];

    if (id == null) return commit([]);
    const next = current.includes(id)
      ? current.filter((v) => v !== id)
      : [...current, id];

    return commit(next);
  } else {
    // single-select
    if (isRadioButton.value) {
      if (id == null) return;
      const current = selectedItemIndexes.value as ListSelectedItemIndex | null;
      const next = id;

      if (current === next) return;

      return commit(next);
    } else {
      const current = selectedItemIndexes.value as ListSelectedItemIndex | null;
      const next = current === id ? null : id;
      return commit(next);
    }
  }
};

const effectiveVariant = computed(() =>
  props.isJoined ? "content" : (props.variant ?? "default")
);

const isCurrentItemShown = computed(() => !!props.isCurrentItemShown);
const isSelectable = computed(() => !!props.isSelectable);
const isRadioButton = computed(() => !!props.isRadioButton);
const isClickable = computed(() => !!props.isClickable);
const isJoined = computed(() => !!props.isJoined);

const isMultipleEffective = computed(
  () => isSelectable.value && !isRadioButton.value && !!props.isMultiple
);

const rootRole = computed(() => {
  if (!isSelectable.value) return "list";
  return isRadioButton.value ? "radiogroup" : "listbox";
});

const localSelectedItemIndexes = ref<
  ListSelectedItemIndex | ListSelectedItemIndex[] | null
>(props.selectedItemIndexes ?? (props.isMultiple ? [] : null));

watch(
  () => props.selectedItemIndexes,
  (newValue) => {
    localSelectedItemIndexes.value = newValue ?? (props.isMultiple ? [] : null);
  }
);

const normalizedItems = computed<IListItem[] | null>(() => {
  if (!props.items) return null;

  const items = props.items;

  if (typeof items[0] === "string") {
    return (items as string[]).map((title, idx) => ({ id: idx, title }));
  }
  return items as IListItem[];
});

watch(
  [normalizedItems, isRadioButton, selectedItemIndexes],
  () => {
    if (!isSelectable.value || !isRadioButton.value) return;
    const items = normalizedItems.value;
    if (!items?.length) return;

    const firstId = items[0].id;

    const current = selectedItemIndexes.value as ListSelectedItemIndex | null;
    const exists = current != null && items.some((it) => it.id === current);

    if (exists) return;

    commit(firstId);
  },
  { immediate: true }
);

provide<ListInjection>(ListInjectionKey, {
  selectedItemIndexes,
  setSelectedItemIndexes,
  isCurrentItemShown,
  isSelectable,
  isRadioButton,
  isClickable,
  isJoined,
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
      e.preventDefault();
      move(1);
      break;
    case "ArrowUp":
    case "ArrowLeft":
      e.preventDefault();
      move(-1);
      break;
    case "Home":
      e.preventDefault();
      focusIndex.value = 0;
      break;
    case "End":
      e.preventDefault();
      focusIndex.value = normalizedItems.value.length - 1;
      break;
    case "Enter":
    case " ":
      e.preventDefault();
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
    :role="rootRole"
    :aria-multiselectable="isSelectable ? isMultipleEffective : undefined"
    @keydown="onKeydown"
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
