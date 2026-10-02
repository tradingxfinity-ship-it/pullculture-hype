import type { Metadata } from "next";
import FavoritesView from "@/components/account/FavoritesView";

export const metadata: Metadata = { title: "Favorites" };

export default function FavoritesPage() {
  return <FavoritesView />;
}
