import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RipExperience from "@/components/rip/RipExperience";
import { getPack } from "@/lib/data";


export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const p = getPack(decodeURIComponent((await params).name));
  return { title: p ? `Rip ${p.name}` : "Rip a pack" };
}

export default async function RipPage({ params, searchParams }: { params: Promise<{ name: string }>; searchParams: Promise<{ qty?: string }> }) {
  const pack = getPack(decodeURIComponent((await params).name));
  if (!pack) notFound();
  const qty = Math.min(10, Math.max(1, Number((await searchParams).qty) || 1));
  return <RipExperience pack={pack} qty={qty} />;
}
