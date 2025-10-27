<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

import type {
  TreeViewNode,
  TreeViewNodeID,
} from "@/components/molecules/explorer/tree-view/TreeViewItem";
import type { TreeViewSelectedItemIndexes } from "@/components/molecules/explorer/tree-view/TreeView";
import {
  FILES_TREE_PREFIX,
  type FilesTreeProps,
  type ResponseError,
} from "@/components/organisms/explorer/FilesTree";
import TreeView from "@/components/molecules/explorer/tree-view/TreeView.vue";
import Text from "@/components/atoms/typography/Text.vue";

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
const loadError = ref<ResponseError | null>(null);

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
  if (api.startsWith("http")) return new URL(api);

  if (typeof window === "undefined")
    throw new Error(
      "[FilesTree] Cannot resolve relative apiUrl when window is undefined"
    );

  const origin =
    window.parent?.location?.origin || window.location?.origin || "";
  const normalized = api.startsWith("/") ? api : `/${api}`;

  if (!origin)
    throw new Error(
      "[FilesTree] Unable to determine base origin for relative apiUrl"
    );

  return new URL(normalized, origin);
};

const fetchChildren = async (
  parentId: TreeViewNodeID | null
): Promise<TreeViewNode[]> => {
  const url = resolveApiUrl(props.apiUrl);

  if (parentId != null) url.searchParams.set("parentId", String(parentId));

  try {
    if (typeof fetch !== "function")
      throw new Error("[FilesTree] Fetch API is not available in this context");

    const res = await fetch(url.toString(), { headers: props.headers });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);

    const raw = (await res.json()) as unknown;
    const items = props.mapResponse
      ? props.mapResponse(raw)
      : (raw as TreeViewNode[]);

    setNodeDefaults(items);
    emit("loaded", parentId, items);
    loadError.value = null;

    return items;
  } catch (e: unknown) {
    const error = e as ResponseError;
    emit("error", error);
    loadError.value = error;

    return [];
  }
};

const ensureRoot = async (): Promise<void> => {
  rootLoading.value = true;

  const items = await fetchChildren(props.rootId ?? null);

  rootNodes.value = items;
  rootLoading.value = false;
};

const onToggle = async (node: TreeViewNode, next: boolean) => {
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
};

const expandToDepth = async (
  nodes: TreeViewNode[] | undefined,
  depth: number
) => {
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
};

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
  <div :class="FILES_TREE_PREFIX" :data-testid="`${FILES_TREE_PREFIX}`">
    <div
      v-if="rootLoading && apiLoadingMessage"
      :class="`${FILES_TREE_PREFIX}__loading`"
    >
      <slot name="loading">
        <Text :data-testid="`${FILES_TREE_PREFIX}__loading-message`">{{
          apiLoadingMessage
        }}</Text>
      </slot>
    </div>
    <div
      v-else-if="loadError && apiErrorMessage"
      :class="`${FILES_TREE_PREFIX}__error`"
    >
      <slot name="error">
        <Text :data-testid="`${FILES_TREE_PREFIX}__error-message`">
          {{ apiErrorMessage }}
        </Text>
      </slot>
    </div>
    <TreeView
      v-else
      v-model:selected-item-indexes="selectionProxy"
      :variant="variant"
      :size="size"
      :mode="mode"
      :tone="tone"
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
