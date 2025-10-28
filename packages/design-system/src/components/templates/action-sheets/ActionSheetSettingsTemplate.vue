<script setup lang="ts">
import { ref, watch } from "vue";

import { actionSheetVariantFacets } from "@/adapters";

import { useLayoutStore } from "@/stores/useLayoutStore";

import { useBreakpoints } from "@/composables/local/responsive/useBreakpoints";

import ActionSheet from "@/components/molecules/sheets/ActionSheet.vue";
import ActionSheetSidebar from "@/components/molecules/sheets/ActionSheetSidebar.vue";

import List from "@/components/molecules/list/List.vue";
import MenuItem from "@/components/molecules/menu/MenuItem.vue";
import Spacer from "@/components/atoms/containers/Spacer.vue";

import type { ActionSheetProps } from "@/components/molecules/sheets/ActionSheet";
import type { ActionSheetSettingsTemplateProps } from "./ActionSheetSettingsTemplate";
import type { ListSelectedItemIndex } from "@/components/molecules/list/List";

const DEFAULT_FACETS: Pick<ActionSheetProps, "variant" | "size"> = {
  variant: "default",
  size: "lg",
};

const props = withDefaults(defineProps<ActionSheetSettingsTemplateProps>(), {
  containerId: "#app",
  isOpen: false,
});

const emit = defineEmits<{
  (
    e: "update:selected-item-indexes",
    selectedItemIndexes: ListSelectedItemIndex | null
  ): void;
  (e: "update:is-open", isOpen: boolean): void;
}>();

const layoutStore = useLayoutStore();
const { breakpoints } = layoutStore;

const localIsOpen = ref(props.isOpen);

watch(
  () => props.isOpen,
  (value) => {
    localIsOpen.value = value;
  },
  { immediate: true }
);

watch(localIsOpen, (value) => {
  emit("update:is-open", value);
});

const getInitSelectedItemIndex = (): ListSelectedItemIndex | null => {
  if (Array.isArray(props.menuItems.top) && props.menuItems.top.length > 0)
    return props.menuItems.top[0].id;

  return null;
};

const localSelectedItemIndexes = ref(getInitSelectedItemIndex());

watch(
  () => props.selectedItemIndexes,
  (newValue) => {
    localSelectedItemIndexes.value = newValue;
  },
  {
    immediate: true,
  }
);

const onUpdateSelectedItemIndexes = (
  selectedItemIndexes: ListSelectedItemIndex | ListSelectedItemIndex[] | null
): void => {
  if (!Array.isArray(selectedItemIndexes))
    emit("update:selected-item-indexes", selectedItemIndexes);
};

/* * * Layout * * */

const { up, raw } = useBreakpoints(breakpoints);

const sidebarAtLeast = ((): keyof typeof raw => {
  const below =
    actionSheetVariantFacets.default.lg.root.width.$respond?.below ?? {};

  const keys = Object.keys(below).filter(
    (k) => k in raw
  ) as (keyof typeof raw)[];

  if (!keys.length) return "md";

  return keys.sort((a, b) => raw[a].$value - raw[b].$value)[keys.length - 1];
})();

const isSidebarShownByToken = up(sidebarAtLeast);
</script>

<template>
  <ActionSheet
    v-model:is-open="localIsOpen"
    :container-id="containerId"
    :variant="DEFAULT_FACETS.variant"
    :size="DEFAULT_FACETS.size"
    mode="neutral"
    tone="canvas"
    orientation="horizontal"
    align-horizontal="start"
    align-vertical="start"
  >
    <template #sidebar>
      <ActionSheetSidebar v-if="isSidebarShownByToken">
        <List
          v-model:selected-item-indexes="localSelectedItemIndexes"
          size="sm"
          stretch="fill"
          :is-selectable="true"
          :is-radio-button="true"
          :is-joined="false"
          @update:selected-item-indexes="onUpdateSelectedItemIndexes"
        >
          <MenuItem
            v-if="'top' in menuItems"
            v-for="item in menuItems.top"
            :id="item.id"
            :is-active="true"
            :title="item.label"
            :icon-name="item.iconName"
          ></MenuItem>
          <Spacer></Spacer>
          <MenuItem
            v-if="'bottom' in menuItems"
            v-for="item in menuItems.bottom"
            :id="item.id"
            :is-active="true"
            :title="item.label"
            :icon-name="item.iconName"
          ></MenuItem>
        </List>
      </ActionSheetSidebar>
    </template>
    <slot></slot>
  </ActionSheet>
</template>
