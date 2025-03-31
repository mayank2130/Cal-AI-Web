import { FitnessTracker } from "@/components/fitness-tracker";
import { Navbar } from "@/components/navbar";
import { LeaderboardPopup } from "@/components/leaderboard-popup";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black main-content">
      <Navbar />
      <div className="flex-grow max-w-screen-2xl mx-auto px-6 sm:px-10 w-full">
        <FitnessTracker />
      </div>
      <Footer />
      <LeaderboardPopup />
    </div>
  );
}
