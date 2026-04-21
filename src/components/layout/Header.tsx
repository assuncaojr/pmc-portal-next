import { getMenu } from "@/lib/wordpress";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const menuItems = await getMenu("navigation");

  return <HeaderClient menuItems={menuItems} />;
}
