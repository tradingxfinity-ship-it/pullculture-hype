import type { Metadata } from "next";
import LegalPage from "@/components/sections/LegalPage";
import { shipping } from "@/lib/legal";

export const metadata: Metadata = { title: "Shipping Policy" };

export default function ShippingPage() {
  return <LegalPage doc={shipping} />;
}
