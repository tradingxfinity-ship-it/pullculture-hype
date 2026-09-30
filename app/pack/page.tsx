import type { Metadata } from "next";
import PacksView from "@/components/sections/packs/PacksView";

export const metadata: Metadata = { title: "Packs" };

export default function PacksPage() {
  return <PacksView />;
}
