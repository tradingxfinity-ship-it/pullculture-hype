import type { Metadata } from "next";
import { Suspense } from "react";
import SettingsView from "@/components/account/SettingsView";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  // useSearchParams (for ?tab=) needs a Suspense boundary during static rendering.
  return (
    <Suspense>
      <SettingsView />
    </Suspense>
  );
}
