import { createRouter, createWebHistory } from "vue-router/auto";
import { routes } from "vue-router/auto-routes";

import { routes as extendedRoutes } from "./extendedRoutes";

import { useAuthStore } from "@/stores";

import { Composables } from "@alma/design-system";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...extendedRoutes, ...routes],
});

router.beforeEach((to, from, next) => {
  Composables.Local.trackRouteHistory(to, from);

  /* * * Auth * * */

  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    console.log(
      "to.meta.requiresAuth: ",
      to.meta.requiresAuth,
      "!auth.isLoggedIn: ",
      !auth.isLoggedIn
    );
    return next({ path: "/auth/login" });
  }

  next();
});
