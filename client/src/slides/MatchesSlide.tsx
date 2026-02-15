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
import { Badge } from "@/components/ui/badge";
import { getMatchYears, getAllStages, matches as allMatches, type Match } from "@/data";
import { useFavoritesStore } from "@/store/favorites";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { translateCountry, translateStage } from "@/lib/translation-utils";

interface MatchesSlideProps {
  onShowDetails: (match: Match) => void;
}

/**
 * Renders a searchable, filterable list of matches with controls for year and stage.
 *
 * @param onShowDetails - Callback invoked with a `Match` when a match's Details button is clicked.
 * @returns The MatchesSlide React element.
 */
export function MatchesSlide({ onShowDetails }: MatchesSlideProps) {
  const years = useMemo(() => getMatchYears(), []);
  const stages = useMemo(() => getAllStages(), []);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedStage, setSelectedStage] = useState<string>("all");
  const { t } = useTranslation();
  const ts = (stage: string) => translateStage(t, stage);

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
    <div
      className="flex flex-col min-h-full px-6 py-14 bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50"
      data-testid="matches-slide-content"
    >
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-kid-3xl md:text-kid-4xl font-bold text-foreground mb-6 text-center flex items-center justify-center gap-3 flex-wrap"
        data-testid="text-matches-title"
      >
        <Search className="w-10 h-10 text-sky-500" data-testid="icon-search" />
        {t.matches.title}
      </motion.h2>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap justify-center gap-4 mb-6"
        data-testid="filters-container"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" data-testid="icon-filter" />
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger
              className="w-40 min-h-12 text-kid-base font-medium rounded-xl"
              data-testid="select-year"
            >
              <SelectValue placeholder={t.matches.selectYear} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" data-testid="select-year-option-all">{t.matches.allYears}</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()} data-testid={`select-year-option-${year}`}>
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
              <SelectValue placeholder={t.matches.selectStage} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" data-testid="select-stage-option-all">{t.matches.allStages}</SelectItem>
              {stages.map((stage) => (
                <SelectItem key={stage} value={stage} data-testid={`select-stage-option-${stage}`}>
                  {ts(stage)}
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
                data-testid="text-no-matches"
              >
                {t.matches.noMatches}
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
  const { t } = useTranslation();
  const isFavorite = isMatchFavorite(match.id);
  const tc = (name: string) => translateCountry(t, name);
  const ts = (stage: string) => translateStage(t, stage);

  const handleAddFavorite = () => {
    if (isFavorite) {
      toast({
        title: t.matches.alreadySaved,
        description: t.matches.alreadySavedDesc,
      });
      return;
    }
    addMatch(match);
    toast({
      title: t.matches.matchSaved,
      description: `${tc(match.homeTeam)} vs ${tc(match.awayTeam)} ${t.matches.matchSavedDesc}`,
    });
  };

  return (
    <Card
      className="border-2 border-sky-100 shadow-lg"
      data-testid={`card-match-${match.id}`}
    >
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="secondary" data-testid={`badge-stage-${match.id}`}>
                {ts(match.stage)}
              </Badge>
              <span className="text-kid-xs text-muted-foreground font-medium" data-testid={`text-year-${match.id}`}>
                {match.tournamentYear}
              </span>
            </div>

            <div className="flex items-center justify-center gap-4 mb-2 flex-wrap">
              <span
                className="text-kid-lg md:text-kid-xl font-bold text-foreground text-right flex-1"
                data-testid={`text-home-team-${match.id}`}
              >
                {tc(match.homeTeam)}
              </span>
              <span
                className="text-kid-2xl md:text-kid-3xl font-bold font-mono text-sky-600 px-4 py-2 rounded-xl bg-sky-50"
                data-testid={`text-score-${match.id}`}
              >
                {match.homeScore} - {match.awayScore}
              </span>
              <span
                className="text-kid-lg md:text-kid-xl font-bold text-foreground text-left flex-1"
                data-testid={`text-away-team-${match.id}`}
              >
                {tc(match.awayTeam)}
              </span>
            </div>

            <p
              className="text-kid-sm text-muted-foreground text-center"
              data-testid={`text-stadium-${match.id}`}
            >
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
              {t.matches.details}
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
