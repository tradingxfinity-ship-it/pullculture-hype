import type { Metadata } from "next";
import LegalPage from "@/components/sections/LegalPage";
import { privacy } from "@/lib/legal";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return <LegalPage doc={privacy} />;
}
