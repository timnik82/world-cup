import { useState, lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Deck, Slide } from "@/deck/Deck";
import { IntroSlide } from "@/slides/IntroSlide";
import { TimelineSlide } from "@/slides/TimelineSlide";
import { MatchesSlide } from "@/slides/MatchesSlide";
import { MatchDetailsModal } from "@/slides/MatchDetailsModal";
import { RecordsSlide } from "@/slides/RecordsSlide";
import { FavoritesSlide } from "@/slides/FavoritesSlide";
import type { Match } from "@/data";

function Presentation() {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowDetails = (match: Match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Deck>
        <Slide index={0}>
          <IntroSlide />
        </Slide>
        <Slide index={1}>
          <TimelineSlide />
        </Slide>
        <Slide index={2}>
          <MatchesSlide onShowDetails={handleShowDetails} />
        </Slide>
        <Slide index={3}>
          <RecordsSlide />
        </Slide>
        <Slide index={4}>
          <FavoritesSlide />
        </Slide>
      </Deck>

      <MatchDetailsModal
        match={selectedMatch}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Presentation />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
