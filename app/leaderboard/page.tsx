import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Leaderboard from "@/components/sections/Leaderboard";

export const metadata: Metadata = { title: "Leaderboard" };

export default function LeaderboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Leaderboard — Monthly"
        title={["Rank up.", <>Win <em key="e" className="font-serif font-normal italic tracking-[-0.02em] text-accent">grails.</em></>]}
        intro="Bigger packs mean bigger points. The top three collectors each month take home a graded grail."
      />
      <Leaderboard />
    </>
  );
}
