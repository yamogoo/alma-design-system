export interface ISimpleMenuItem<T = string> {
  id: number;
  label: string;
  value: T;
  [key: string]: unknown;
}

export type SimpleMenuItems<T = string> = Array<ISimpleMenuItem<T>>;
