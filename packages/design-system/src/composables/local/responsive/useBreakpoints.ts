// This file were developed with the assistance of AI tools.
//
import { ref, onMounted, onBeforeUnmount, type Ref } from "vue";

export type BreakpointMap = Record<string, { $value: number }>;

type MediaRef = Ref<boolean>;

const EPSILON = 0.02;

function makeMediaRef(query: string): MediaRef {
  const r = ref(false);
  if (typeof window === "undefined") return r;

  const mql = window.matchMedia(query);
  r.value = mql.matches;

  const handler = (e: MediaQueryListEvent) => (r.value = e.matches);

  mql.addEventListener?.("change", handler);

  onBeforeUnmount(() => {
    mql.removeEventListener?.("change", handler);
  });

  return r;
}

export const useBreakpoints = <const M extends BreakpointMap>(bps: M) => {
  const entries = Object.entries(bps).sort(
    (a, b) => a[1].$value - b[1].$value
  ) as Array<readonly [keyof M & string, { $value: number }]>;
  const keys = entries.map(([k]) => k);
  const map = Object.fromEntries(entries) as {
    [K in keyof M & string]: { $value: number };
  };

  function up<K extends keyof M & string>(key: K): MediaRef {
    return makeMediaRef(`(min-width:${map[key].$value}px)`);
  }

  function down<K extends keyof M & string>(key: K): MediaRef {
    return makeMediaRef(`(max-width:${map[key].$value - EPSILON}px)`);
  }

  function between<A extends keyof M & string, B extends keyof M & string>(
    a: A,
    b: B
  ): MediaRef {
    const min = map[a].$value;
    const max = map[b].$value - EPSILON;
    return makeMediaRef(`(min-width:${min}px) and (max-width:${max}px)`);
  }

  const current: Ref<keyof M | null> = ref(null);
  const updateCurrent = () => {
    if (typeof window === "undefined") return;
    const w = window.innerWidth;
    let curr: keyof M | null = null;
    for (const [k, v] of entries) if (w >= v.$value) curr = k;
    current.value = curr;
  };

  onMounted(() => {
    updateCurrent();
    window.addEventListener("resize", updateCurrent, { passive: true });
  });

  onBeforeUnmount(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", updateCurrent);
    }
  });

  function keyFromWidth(widthPx: number): keyof M | null {
    let curr: keyof M | null = null;
    for (const [k, v] of entries) if (widthPx >= v.$value) curr = k;
    return curr;
  }

  return {
    keys,
    raw: map,
    up,
    down,
    between,
    current,
    keyFromWidth,
  };
};
