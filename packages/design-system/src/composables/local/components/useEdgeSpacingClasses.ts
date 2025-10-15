import { computed, type ComputedRef } from "vue";
import {
  UIElementPositions,
  UIElementShortPositionAliases,
  UIElementShortPositions,
  type UIElementEdgeSpacing,
  type UIElementShortPosition,
} from "@/typings";

export interface EdgeSpacingProps {
  padding?:
    | ReadonlyArray<UIElementEdgeSpacing>
    | UIElementEdgeSpacing
    | Set<UIElementEdgeSpacing>;
  margin?:
    | ReadonlyArray<UIElementEdgeSpacing>
    | UIElementEdgeSpacing
    | Set<UIElementEdgeSpacing>;
  gap?:
    | ReadonlyArray<UIElementEdgeSpacing>
    | UIElementEdgeSpacing
    | Set<UIElementEdgeSpacing>;
}

export interface UseEdgeSpacingClassesOptions {
  prefix: string;
  modifiers?: {
    padding?: string;
    margin?: string;
    gap?: string;
  };
}

const toSelectedSet = (
  v: EdgeSpacingProps[keyof EdgeSpacingProps]
): Set<string> => {
  if (v == null) return new Set();
  if (v instanceof Set) return new Set([...v].map(String));
  if (Array.isArray(v)) return new Set(v.map(String));
  return new Set([String(v)]);
};

const longToShort: Record<string, UIElementShortPosition | undefined> =
  Object.fromEntries(
    Object.entries(UIElementShortPositions).map(([k, short]) => [
      k.toLowerCase(),
      short,
    ])
  );

const resolvePositions = (
  selected: Set<string>
): (typeof UIElementPositions)[number][] => {
  const out: (typeof UIElementPositions)[number][] = [];
  for (const pos of UIElementPositions) {
    const key = String(pos).toLowerCase();
    const shortKey = longToShort[key];
    const alias =
      key === "left" || key === "right"
        ? UIElementShortPositionAliases.HORIZONTAL
        : UIElementShortPositionAliases.VERTICAL;

    if (
      selected.has(key) ||
      (shortKey && selected.has(String(shortKey))) ||
      selected.has(String(alias))
    ) {
      out.push(pos);
    }
  }
  return out;
};

const buildClasses = (
  prefix: string,
  mod: string,
  positions: (typeof UIElementPositions)[number][]
) => {
  return positions.map((p) => `${prefix}_${mod}-${p}`);
};

export const useEdgeSpacingClasses = (
  props: EdgeSpacingProps,
  { prefix, modifiers }: UseEdgeSpacingClassesOptions
): {
  paddingClasses: ComputedRef<string[]>;
  marginClasses: ComputedRef<string[]>;
  gapClasses: ComputedRef<string[]>;
  classes: ComputedRef<string[]>;
} => {
  const mods = {
    padding: modifiers?.padding ?? "padding",
    margin: modifiers?.margin ?? "margin",
    gap: modifiers?.gap ?? "gap",
  };

  const paddingClasses = computed(() => {
    const selected = toSelectedSet(props.padding);
    if (selected.size === 0) return [];
    return buildClasses(prefix, mods.padding, resolvePositions(selected));
  });

  const marginClasses = computed(() => {
    const selected = toSelectedSet(props.margin);
    if (selected.size === 0) return [];
    return buildClasses(prefix, mods.margin, resolvePositions(selected));
  });

  const gapClasses = computed(() => {
    const selected = toSelectedSet(props.gap);
    if (selected.size === 0) return [];
    return buildClasses(prefix, mods.gap, resolvePositions(selected));
  });

  const classes = computed(() => [
    ...paddingClasses.value,
    ...marginClasses.value,
    ...gapClasses.value,
  ]);

  return { paddingClasses, marginClasses, gapClasses, classes };
};
