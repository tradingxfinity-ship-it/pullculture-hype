import type { Metadata } from "next";
import WalletView from "@/components/account/WalletView";

export const metadata: Metadata = { title: "Wallet" };

export default function WalletPage() {
  return <WalletView />;
}
