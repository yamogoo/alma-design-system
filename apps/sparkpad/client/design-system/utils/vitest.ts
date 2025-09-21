import type { VueWrapper } from "@vue/test-utils";

export const getTypedEmittedEvent = <V>(
  wrapper: VueWrapper,
  eventName: string
) => {
  return wrapper.emitted(eventName) as V[][];
};

export const mountWithTeleport = () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = `<div id="app"></div>`;
  });
};

export const setupGSAP = () => {
  vi.mock("gsap", () => ({
    default: {
      fromTo: vi.fn(),
      to: vi.fn(),
    },
  }));
};
