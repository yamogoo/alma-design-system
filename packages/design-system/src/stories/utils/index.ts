import type { InputType } from "storybook/internal/types";

export const enumOptions = <T>(arr: readonly T[]): InputType => ({
  control: "select",
  options: arr,
});

export const booleanOptions = (defaultValue?: boolean): InputType => ({
  control: "boolean",
  type: "boolean",
  ...(defaultValue ? { defaultValue } : {}),
});

export const numberOptions = (defaultValue?: number): InputType => ({
  control: "number",
  type: "number",
  ...(defaultValue ? { defaultValue } : {}),
});

export const stringOptions = (defaultValue?: string): InputType => ({
  control: "text",
  type: "string",
  ...(defaultValue ? { defaultValue } : {}),
});

export const objectOptions = <T>(defaultValue?: T): InputType => ({
  control: "object",
  ...(defaultValue ? { defaultValue } : {}),
});
