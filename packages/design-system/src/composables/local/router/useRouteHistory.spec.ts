import type { RouteLocationNormalized } from "vue-router";

import { useRouteHistory, trackRouteHistory } from "./useRouteHistory";

const mockRoute = (
  path: string,
  meta: Record<string, unknown> = {}
): RouteLocationNormalized => ({
  fullPath: path,
  path,
  meta,
  matched: [],
  name: "/auth/login",
  params: {},
  query: {},
  hash: "",
  redirectedFrom: undefined,
});

describe("useRouteHistory", () => {
  beforeEach(() => {
    trackRouteHistory(
      {} as RouteLocationNormalized,
      {} as RouteLocationNormalized
    );
  });

  test("returns empty meta objects by default", () => {
    const { prevMeta, currentMeta, nextMeta } = useRouteHistory();
    expect(prevMeta.value).toEqual({});
    expect(currentMeta.value).toEqual({});
    expect(nextMeta.value).toEqual({});
  });

  test("correctly tracks from and to routes", () => {
    const fromRoute = mockRoute("/from", { title: "From Page" });
    const toRoute = mockRoute("/to", { title: "To Page" });

    trackRouteHistory(toRoute, fromRoute);

    const {
      prevMeta,
      currentMeta,
      nextMeta,
      prevRoute,
      currentRoute,
      nextRoute,
    } = useRouteHistory();

    expect(prevMeta.value).toEqual({ title: "From Page" });
    expect(currentMeta.value).toEqual({ title: "To Page" });
    expect(nextMeta.value).toEqual({ title: "To Page" });

    expect(prevRoute.value?.path).toBe("/from");
    expect(currentRoute.value?.path).toBe("/to");
    expect(nextRoute.value?.path).toBe("/to");
  });

  test("returns null routes initially", () => {
    const { prevRoute, currentRoute, nextRoute } = useRouteHistory();
    expect(prevRoute.value).toBeTypeOf("object");
    expect(currentRoute.value).toBeTypeOf("object");
    expect(nextRoute.value).toBeTypeOf("object");
  });
});
