import type { RouteNamedMap } from "vue-router/auto-routes";

export type RoutePath = RouteNamedMap[keyof RouteNamedMap]["path"];
