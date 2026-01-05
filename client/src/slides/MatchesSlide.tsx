import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllYears, getAllStages, getMatchesByYearAndStage, matches as allMatches, type Match } from "@/data";
import { useFavoritesStore } from "@/store/favorites";
import { useToast } from "@/hooks/use-toast";

interface MatchesSlideProps {
  onShowDetails: (match: Match) => void;
}

export function MatchesSlide({ onShowDetails }: MatchesSlideProps) {
  const years = useMemo(() => getAllYears(), []);
  const stages = useMemo(() => getAllStages(), []);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedStage, setSelectedStage] = useState<string>("all");

  const filteredMatches = useMemo(() => {
    let result = allMatches;
    if (selectedYear !== "all") {
      result = result.filter((m) => m.tournamentYear === parseInt(selectedYear));
    }
    if (selectedStage !== "all") {
      result = result.filter((m) => m.stage === selectedStage);
    }
    return result;
  }, [selectedYear, selectedStage]);

  return (
    <div className="flex flex-col h-full px-6 py-8 bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50">
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-kid-3xl md:text-kid-4xl font-bold text-foreground mb-6 text-center flex items-center justify-center gap-3"
      >
        <Search className="w-10 h-10 text-sky-500" />
        Explore Matches
      </motion.h2>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap justify-center gap-4 mb-6"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger
              className="w-40 min-h-12 text-kid-base font-medium rounded-xl"
              data-testid="select-year"
            >
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedStage} onValueChange={setSelectedStage}>
            <SelectTrigger
              className="w-44 min-h-12 text-kid-base font-medium rounded-xl"
              data-testid="select-stage"
            >
              <SelectValue placeholder="Select Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {stages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <ScrollArea className="flex-1 w-full max-w-5xl mx-auto">
        <div className="grid gap-4 pb-4">
          <AnimatePresence mode="popLayout">
            {filteredMatches.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-muted-foreground text-kid-lg"
              >
                No matches found with these filters. Try different options!
              </motion.div>
            ) : (
              filteredMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MatchCard match={match} onShowDetails={onShowDetails} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}

function MatchCard({
  match,
  onShowDetails,
}: {
  match: Match;
  onShowDetails: (match: Match) => void;
}) {
  const { addMatch, isMatchFavorite } = useFavoritesStore();
  const { toast } = useToast();
  const isFavorite = isMatchFavorite(match.id);

  const handleAddFavorite = () => {
    if (isFavorite) {
      toast({
        title: "Already saved!",
        description: "This match is in your favorites.",
      });
      return;
    }
    addMatch(match);
    toast({
      title: "Match saved!",
      description: `${match.homeTeam} vs ${match.awayTeam} added to favorites.`,
    });
  };

  return (
    <Card className="border-2 border-sky-100 shadow-lg hover:shadow-xl transition-shadow bg-white/95">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-kid-xs font-semibold rounded-full bg-sky-100 text-sky-700">
                {match.stage}
              </span>
              <span className="text-kid-xs text-muted-foreground font-medium">
                {match.tournamentYear}
              </span>
            </div>

            <div className="flex items-center justify-center gap-4 mb-2">
              <span className="text-kid-lg md:text-kid-xl font-bold text-foreground text-right flex-1">
                {match.homeTeam}
              </span>
              <span className="text-kid-2xl md:text-kid-3xl font-bold font-mono text-sky-600 px-4 py-2 rounded-xl bg-sky-50">
                {match.homeScore} - {match.awayScore}
              </span>
              <span className="text-kid-lg md:text-kid-xl font-bold text-foreground text-left flex-1">
                {match.awayTeam}
              </span>
            </div>

            <p className="text-kid-sm text-muted-foreground text-center">
              {match.stadium}, {match.city}
            </p>
          </div>

          <div className="flex justify-center gap-2">
            <Button
              size="lg"
              onClick={() => onShowDetails(match)}
              className="min-h-12 px-6 text-kid-base font-semibold rounded-xl"
              data-testid={`button-details-${match.id}`}
            >
              <Eye className="w-5 h-5 mr-2" />
              Details
            </Button>
            <Button
              size="lg"
              variant={isFavorite ? "secondary" : "outline"}
              onClick={handleAddFavorite}
              className="min-h-12 px-4 rounded-xl"
              data-testid={`button-favorite-${match.id}`}
            >
              <Star
                className={`w-5 h-5 ${isFavorite ? "fill-amber-500 text-amber-500" : ""}`}
              />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
