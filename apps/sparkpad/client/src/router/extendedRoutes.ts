export const routes = [
  {
    path: "/auth",
    alias: "/",
    component: () => import("@/layouts/AuthLayout.vue"),
    meta: { requiresAuth: false },
    children: [
      {
        path: "login",
        alias: "/",
        component: () => import("@/pages/auth/login.vue"),
        meta: { rid: -1, requiresAuth: false },
      },
    ],
  },
  {
    path: "/editor",
    component: () => import("@/layouts/EditorLayout.vue"),
    meta: { requiresAuth: false },
    children: [
      {
        path: "",
        component: () => import("@/pages/editor/index.vue"),
        meta: { rid: 100, requiresAuth: false },
      },
    ],
  },
];
