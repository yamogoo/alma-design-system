import { computed } from "vue";

export type FacetValue = string | boolean | undefined;

export interface UseFacetsClassesOptions<
  F extends string = string,
  M extends string = string,
> {
  prefix: string;
  props: Record<string, unknown>;
  facets?: F[];
  modifiers?: M[];
  map?: Record<string, string>;
}

export const useFacetsClasses = <F extends string, M extends string>({
  prefix,
  props,
  facets = [],
  modifiers = [],
  map = {},
}: UseFacetsClassesOptions<F, M>) => {
  const getKey = (key: string) => map[key] ?? key;

  const makeClass = (key: string, val?: FacetValue) => {
    if (val === undefined || val === false) return null;
    if (val === true) return `${prefix}_${getKey(key)}`;

    return `${prefix}_${getKey(key)}-${val}`;
  };

  const classes = computed(() => {
    const base = [prefix];

    const facetClasses = facets
      .map((key) => makeClass(getKey(key), props[key] as FacetValue))
      .filter(Boolean);

    const modifierClasses = modifiers
      .map((key) => makeClass(getKey(key), props[key] as FacetValue))
      .filter(Boolean);

    return [...base, ...facetClasses, ...modifierClasses];
  });

  return { classes };
};
