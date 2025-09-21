export interface IMenuItem<T = string> {
  id: number;
  label: string;
  value: T;
  [key: string]: unknown;
}

export type MenuItems<T = string> = Array<IMenuItem<T>>;
