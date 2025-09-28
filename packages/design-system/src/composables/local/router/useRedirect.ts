import { onMounted } from "vue";
import {
  onBeforeRouteLeave,
  useRouter,
  type RouteLocationRaw,
} from "vue-router";

import { useTimeout } from "@/composables/local";

export type Routes = RouteLocationRaw;

export interface UseRedirect {
  path?: Routes;
  ms?: number;
}

export const useRedirect = (opts?: UseRedirect): void => {
  const { path, ms } = { ms: 2_500, ...opts };
  const router = useRouter();

  const timer = useTimeout(() => {
    if (path) {
      void router.push(path);
    } else {
      router.back();
    }
  }, ms);

  onMounted(() => {
    timer.start();
  });

  onBeforeRouteLeave(() => {
    timer.stop();
  });
};
