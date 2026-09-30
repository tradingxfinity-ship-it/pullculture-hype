import Hero from "@/components/sections/home/Hero";
import RipAPack from "@/components/sections/home/RipAPack";
import RecentPulls from "@/components/sections/home/RecentPulls";
import Stats from "@/components/sections/home/Stats";
import FeaturedAuctions from "@/components/sections/home/FeaturedAuctions";
import RecentSales from "@/components/sections/home/RecentSales";

// Same order as the original home page:
// banner → Rip A Pack → Recent Pulls → Stats → Featured Auctions → Recent Sales.
export default function Home() {
  return (
    <>
      <Hero />
      <RipAPack />
      <RecentPulls />
      <Stats />
      <FeaturedAuctions />
      <RecentSales />
    </>
  );
}
