<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

import { Text } from "@/components/atoms";
import {
  TreeView,
  type TreeViewNode,
  type TreeViewNodeID,
  type TreeViewSelectedItemIndexes,
} from "@/components/molecules";
import type { FilesTreeProps } from "@/components/organisms";

const props = withDefaults(defineProps<FilesTreeProps>(), {
  variant: "default",
  size: "md",
  mode: "neutral",
  tone: "primary",
  apiErrorMessage: "Failed to load",
  apiLoadingMessage: "Loading",
});

const emit = defineEmits<{
  (
    e: "update:selected-item-indexes",
    selectedItemIndexes: TreeViewSelectedItemIndexes
  ): void;
  (e: "loaded", parentId: TreeViewNodeID | null, nodes: TreeViewNode[]): void;
  (e: "error", error: unknown): void;
  (e: "select:item", node: TreeViewNode): void;
}>();

const rootNodes = ref<TreeViewNode[]>([]);
const rootLoading = ref(true);
const loadError = ref<unknown | null>(null);

const expandedItemIndexes = ref<Set<TreeViewNodeID>>(new Set());
const loadingItemIndexes = ref<Set<TreeViewNodeID>>(new Set());

const selectionProxy = ref<TreeViewSelectedItemIndexes>(
  props.selectedItemIndexes ?? (props.isMultiSelect ? [] : null)
);

const setNodeDefaults = (items: TreeViewNode[]): void => {
  items.forEach((node) => {
    const { type, isLeaf, hasChildren } = node;

    if (isLeaf == null) node.isLeaf = type === "file";
    if (hasChildren == null) node.hasChildren = !isLeaf;
  });
};

const resolveApiUrl = (path?: string): URL => {
  const api = path ?? "/api/tree";

  const base =
    typeof window !== "undefined"
      ? window.parent?.location?.origin || window.location.origin
      : "";

  if (api.startsWith("http")) return new URL(api);

  const normalized = api.startsWith("/") ? api : `/${api}`;
  return new URL(normalized, base);
};

const fetchChildren = async (
  parentId: TreeViewNodeID | null
): Promise<TreeViewNode[]> => {
  const url = resolveApiUrl(props.apiUrl);

  if (parentId != null) url.searchParams.set("parentId", String(parentId));

  try {
    const res = await fetch(url.toString(), { headers: props.headers });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);

    const raw = await res.json();
    const items = props.mapResponse
      ? props.mapResponse(raw)
      : (raw as TreeViewNode[]);

    setNodeDefaults(items);
    emit("loaded", parentId, items);
    loadError.value = null;

    return items;
  } catch (e) {
    emit("error", e);
    loadError.value = e;

    return [];
  }
};

const ensureRoot = async (): Promise<void> => {
  rootLoading.value = true;

  const items = await fetchChildren(props.rootId ?? null);

  rootNodes.value = items;
  rootLoading.value = false;
};

async function onToggle(node: TreeViewNode, next: boolean) {
  const id = node.id;
  if (next) {
    if (!node.isLeaf && !Array.isArray(node.children)) {
      loadingItemIndexes.value.add(id);

      node.children = await fetchChildren(id);

      loadingItemIndexes.value.delete(id);
    }
    expandedItemIndexes.value.add(id);
  } else {
    expandedItemIndexes.value.delete(id);
  }
}

async function expandToDepth(nodes: TreeViewNode[] | undefined, depth: number) {
  if (!nodes || depth <= 0) return;
  for (const node of nodes) {
    const { id, isLeaf, children } = node;

    if (!isLeaf) {
      expandedItemIndexes.value.add(id);

      if (!Array.isArray(children)) {
        loadingItemIndexes.value.add(id);
        node.children = await fetchChildren(id);
        loadingItemIndexes.value.delete(id);
      }
      await expandToDepth(node.children ?? undefined, depth - 1);
    }
  }
}

watch(
  () => props.selectedItemIndexes,
  (newIndexes) => {
    selectionProxy.value = newIndexes ?? null;
  },
  { immediate: true }
);

watch(selectionProxy, (newIndexes) =>
  emit("update:selected-item-indexes", newIndexes)
);

onMounted(async () => {
  await ensureRoot();
  if (props.expandDepth! > 0) {
    await expandToDepth(rootNodes.value, props.expandDepth!);
  }
});
</script>

<template>
  <div class="files-tree">
    <div v-if="rootLoading && apiLoadingMessage" class="tree__loading">
      <slot>
        <Text>{{ apiLoadingMessage }}</Text>
      </slot>
    </div>
    <div v-else-if="loadError && apiErrorMessage" class="tree__error">
      <slot
        ><Text>{{ apiErrorMessage }}</Text></slot
      >
    </div>
    <TreeView
      v-else
      :variant="variant"
      :size="size"
      :mode="mode"
      :tone="tone"
      v-model:selected-item-indexes="selectionProxy"
      :nodes="rootNodes"
      :expanded-item-indexes="[...expandedItemIndexes]"
      :loading-item-indexes="[...loadingItemIndexes]"
      :is-multi-select="props.isMultiSelect"
      :is-checkable="props.isCheckable"
      aria-label="Files"
      @toggle:item="onToggle"
      @select:item="$emit('select:item', $event)"
    ></TreeView>
  </div>
</template>
