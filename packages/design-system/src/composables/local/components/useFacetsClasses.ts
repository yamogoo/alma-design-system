import { computed } from "vue";

export type FacetValue = string | boolean | undefined;

export interface FacetMapEntry {
  prop?: string;
  class?: string;
}

export interface UseFacetsClassesOptions<
  F extends string = string,
  M extends string = string,
> {
  prefix: string;
  props: Record<string, unknown>;
  facets?: F[];
  modifiers?: M[];
  map?: Record<string, string | FacetMapEntry>;
}

export const useFacetsClasses = <F extends string, M extends string>({
  prefix,
  props,
  facets = [],
  modifiers = [],
  map = {},
}: UseFacetsClassesOptions<F, M>) => {
  const getMapEntry = (key: string) => map[key];

  const getPropKey = (key: string) => {
    const entry = getMapEntry(key);

    if (typeof entry === "string") return entry;
    if (entry && typeof entry === "object") return entry.prop ?? key;

    return key;
  };

  const getClassKey = (key: string) => {
    const entry = getMapEntry(key);

    if (entry && typeof entry === "object") return entry.class ?? key;

    return key;
  };

  const getPropValue = (key: string): FacetValue => {
    const propKey = getPropKey(key);
    return props[propKey] as FacetValue;
  };

  const createClass = (key: string, val?: FacetValue) => {
    if (val === undefined || val === false) return null;
    if (val === true) return `${prefix}_${key}`;

    return `${prefix}_${key}-${val}`;
  };

  const classes = computed(() => {
    const base = [prefix];

    const facetClasses = facets
      .map((key) => createClass(getClassKey(key), getPropValue(key)))
      .filter(Boolean);

    const modifierClasses = modifiers
      .map((key) => createClass(getClassKey(key), getPropValue(key)))
      .filter(Boolean);

    return [...base, ...facetClasses, ...modifierClasses];
  });

  return { classes };
};
