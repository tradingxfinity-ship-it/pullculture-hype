import type { Metadata } from "next";
import OffersView from "@/components/account/OffersView";

export const metadata: Metadata = { title: "Offers" };

export default function OffersPage() {
  return <OffersView />;
}
