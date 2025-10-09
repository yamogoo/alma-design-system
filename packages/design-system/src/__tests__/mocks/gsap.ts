import { vi } from "vitest";

type TL = {
  to: ReturnType<typeof vi.fn>;
  from: ReturnType<typeof vi.fn>;
  fromTo: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  add: ReturnType<typeof vi.fn>;
  eventCallback: ReturnType<typeof vi.fn>;
  kill: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
  play: ReturnType<typeof vi.fn>;
};

const makeTL = (): TL => ({
  to: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  fromTo: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  add: vi.fn().mockReturnThis(),
  eventCallback: vi.fn().mockReturnThis(),
  kill: vi.fn().mockReturnThis(),
  pause: vi.fn().mockReturnThis(),
  play: vi.fn().mockReturnThis(),
});

const gsapObj = {
  timeline: vi.fn(makeTL),
  to: vi.fn(),
  from: vi.fn(),
  fromTo: vi.fn(),
  set: vi.fn(),
  context: vi.fn((fn?: () => void) => {
    fn?.();
    return { add: vi.fn(), revert: vi.fn() };
  }),
  registerPlugin: vi.fn(),
  core: { Timeline: class {} },
  utils: {},
  globals: vi.fn(() => ({})),
};

export const gsap = gsapObj;
export default gsapObj;
