import type { MenuItems } from "@/components/atoms";

export interface SideMainMenuProps<T = string> {
  selectedItemId: number;
  items: MenuItems<T>;
}
