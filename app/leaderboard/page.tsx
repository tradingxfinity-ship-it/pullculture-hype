import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Leaderboard from "@/components/sections/Leaderboard";

export const metadata: Metadata = { title: "Leaderboard" };

export default function LeaderboardPage() {
  return (
    <>
      <PageHeader
        compact
        eyebrow="Leaderboard — Monthly"
        title={[
          <>
            Rank up. Win <em className="font-serif font-normal italic tracking-[-0.02em] text-accent">grails.</em>
          </>,
        ]}
      />
      <Leaderboard />
    </>
  );
}
