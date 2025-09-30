<script setup lang="tsx">
import { computed, Fragment, h, provide, ref, useSlots } from "vue";

import { ListInjectionKey, type ListInjection, type ListProps } from "./List";
import type { IListItem } from "./ListItem";

import ListItem from "./ListItem.vue";

const PREFIX = "list";

const props = withDefaults(defineProps<ListProps>(), {
  as: "div",
  variant: "default",
  isCurrentItemShown: false,
  isMultiple: false,
  isSelectable: true,
});

const slots = useSlots();

const rootTag = computed(
  () => props.as ?? (props.items?.length ? "ul" : "div")
);

const localSelectedItemId = ref<IListItem["id"] | IListItem["id"][] | null>(
  props.selectedItemId ?? (props.isMultiple ? [] : null)
);

const selectedItemId = computed({
  get: () => {
    return props.selectedItemId !== undefined
      ? (props.selectedItemId ?? null)
      : localSelectedItemId.value;
  },
  set: (value) => {
    // Update local state only when uncontrolled
    if (props.selectedItemId === undefined) localSelectedItemId.value = value;
  },
});

const setSelectedItemId = (id: IListItem["id"] | null) => {
  if (!props.isSelectable) return;

  if (props.isMultiple) {
    const current = (selectedItemId.value ?? []) as IListItem["id"][];
    const next = Array.isArray(current) ? [...current] : [];

    const idx = next.findIndex((v) => v === id);
    if (id == null) {
      // clear selection
      localSelectedItemId.value = [];
      return;
    }
    if (idx >= 0) {
      next.splice(idx, 1);
    } else {
      next.push(id);
    }
    if (props.selectedItemId === undefined) localSelectedItemId.value = next;
  } else {
    const current = selectedItemId.value as IListItem["id"] | null;
    const next = current === id ? null : id;
    if (props.selectedItemId === undefined) localSelectedItemId.value = next;
  }
};

const isCurrentItemShown = computed(() => !!props.isCurrentItemShown);
const isSelectable = computed(() => !!props.isSelectable);

provide<ListInjection>(ListInjectionKey, {
  selectedItemId,
  setSelectedItemId,
  isCurrentItemShown,
  isSelectable,
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
    const onSelect = () => setSelectedItemId(id);

    const vnodeFromSlot = slots.default?.({
      item,
      isSelected: Array.isArray(selectedItemId.value)
        ? selectedItemId.value.includes(id)
        : selectedItemId.value === id,
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
  <component
    :is="rootTag"
    :class="[
      PREFIX,
      {
        [`${PREFIX}_variant-${variant}`]: !!variant,
        [`${PREFIX}_size-${size}`]: !!size,
        [`${PREFIX}_mode-${mode}`]: !!mode,
        [`${PREFIX}_tone-${tone}`]: !!tone,
      },
    ]"
    role="list"
  >
    <slot v-if="!normalizedItems" :selected-id="selectedItemId"></slot>
    <template v-else>
      <component :is="'template'">
        <component :is="{ render: () => renderWithSlot() }" />
      </component>
    </template>
  </component>
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
