import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PacksView from "@/components/sections/packs/PacksView";
import { categories, type Category } from "@/lib/data";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const c = categories.find((x) => x.slug === category);
  return { title: c ? `${c.label} Packs` : "Packs" };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!categories.some((c) => c.slug === category)) notFound();
  return <PacksView active={category as Category} />;
}
