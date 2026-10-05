import type { Metadata } from "next";
import PublicProfile from "@/components/account/PublicProfile";

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  return { title: `@${decodeURIComponent((await params).handle)}` };
}

export default async function ProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  return <PublicProfile handle={decodeURIComponent((await params).handle).replace(/^@/, "")} />;
}
