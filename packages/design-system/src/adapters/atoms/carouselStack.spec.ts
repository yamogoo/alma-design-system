import tokens from "@/tokens";

import { carouselStackSizes } from "./carouselStack";

describe("button adapter", () => {
  test("exports sizes for variant default", () => {
    expect(carouselStackSizes).toEqual(
      Object.keys(tokens.components.atoms.carouselStack.default)
    );
  });
});
