import type { Metadata } from "next";
import DashboardView from "@/components/account/DashboardView";

export const metadata: Metadata = { title: "Dashboard" };

export default function AccountPage() {
  return <DashboardView />;
}
