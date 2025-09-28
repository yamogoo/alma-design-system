import { createPinia, setActivePinia } from "pinia";
import { beforeEach, vi } from "vitest";
import { config } from "@vue/test-utils";

import "vitest-canvas-mock";

beforeEach(() => {
  const pinia = createPinia();
  setActivePinia(pinia);

  config.global.stubs = {
    RouterView: true,
    RouterLink: true,
  };

  if (typeof PointerEvent === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).PointerEvent = class PointerEvent extends MouseEvent {};
  }

  Element.prototype.scrollTo = function () {};

  window.matchMedia = vi.fn((): MediaQueryList => {
    return {
      matches: false,
      media: "",
      onchange: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  });
});
