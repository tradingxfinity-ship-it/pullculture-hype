import type { Metadata } from "next";
import AccountShell from "@/components/account/AccountShell";

export const metadata: Metadata = { title: { default: "Account", template: "%s — Account — Pull Culture" } };

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <AccountShell>{children}</AccountShell>;
}
