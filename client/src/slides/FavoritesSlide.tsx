import { motion, AnimatePresence } from "framer-motion";
import { Star, Trash2, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFavoritesStore } from "@/store/favorites";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";

export function FavoritesSlide() {
  const { favoriteFacts, favoriteMatches, removeFact, removeMatch } = useFavoritesStore();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleRemoveFact = (factId: string) => {
    removeFact(factId);
    toast({
      title: t.favorites.removed,
      description: t.favorites.factRemoved,
    });
  };

  const handleRemoveMatch = (matchId: string) => {
    removeMatch(matchId);
    toast({
      title: t.favorites.removed,
      description: t.favorites.matchRemoved,
    });
  };

  const isEmpty = favoriteFacts.length === 0 && favoriteMatches.length === 0;

  return (
    <div 
      className="flex flex-col min-h-full h-fit px-6 py-14 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50"
      data-testid="favorites-slide-content"
    >
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-kid-3xl md:text-kid-4xl font-bold text-foreground mb-8 text-center flex items-center justify-center gap-3 flex-wrap"
        data-testid="text-favorites-title"
      >
        <Heart className="w-10 h-10 text-rose-500 fill-rose-500" data-testid="icon-heart" />
        {t.favorites.title}
      </motion.h2>

      {isEmpty ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center"
          data-testid="empty-state"
        >
          <div className="p-6 rounded-full bg-rose-100 mb-6">
            <Star className="w-16 h-16 text-rose-300" />
          </div>
          <h3 className="text-kid-2xl font-bold text-foreground mb-3" data-testid="text-empty-title">
            {t.favorites.noFavorites}
          </h3>
          <p className="text-kid-lg text-muted-foreground max-w-md" data-testid="text-empty-message">
            {t.favorites.emptyMessage}
          </p>
        </motion.div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full pb-4">
            <div data-testid="favorite-facts-section">
              <h3 className="text-kid-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-500" />
                {t.favorites.favoriteFacts} ({favoriteFacts.length})
              </h3>
              <div className="space-y-3">
                <AnimatePresence>
                  {favoriteFacts.length === 0 ? (
                    <p className="text-kid-base text-muted-foreground py-4" data-testid="text-no-facts">
                      {t.favorites.noFacts}
                    </p>
                  ) : (
                    favoriteFacts.map((fact) => (
                      <motion.div
                        key={fact.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 20, opacity: 0 }}
                        layout
                      >
                        <Card 
                          className="border-2 border-amber-100 shadow-md"
                          data-testid={`favorite-fact-${fact.id}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-3">
                              <div className="flex-1">
                                <p 
                                  className="text-kid-base text-foreground leading-relaxed"
                                  data-testid={`favorite-fact-text-${fact.id}`}
                                >
                                  {fact.text}
                                </p>
                                {fact.year && (
                                  <p className="text-kid-sm text-muted-foreground mt-2">
                                    {t.favorites.worldCup} {fact.year}
                                  </p>
                                )}
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleRemoveFact(fact.id)}
                                className="flex-shrink-0 text-rose-500"
                                data-testid={`button-remove-fact-${fact.id}`}
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div data-testid="favorite-matches-section">
              <h3 className="text-kid-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="text-xl">⚽</span>
                {t.favorites.favoriteMatches} ({favoriteMatches.length})
              </h3>
              <div className="space-y-3">
                <AnimatePresence>
                  {favoriteMatches.length === 0 ? (
                    <p className="text-kid-base text-muted-foreground py-4" data-testid="text-no-matches">
                      {t.favorites.noMatches}
                    </p>
                  ) : (
                    favoriteMatches.map((match) => (
                      <motion.div
                        key={match.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 20, opacity: 0 }}
                        layout
                      >
                        <Card 
                          className="border-2 border-sky-100 shadow-md"
                          data-testid={`favorite-match-${match.id}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <Badge variant="secondary">
                                    {match.stage}
                                  </Badge>
                                  <span className="text-kid-xs text-muted-foreground">
                                    {match.tournamentYear}
                                  </span>
                                </div>
                                <div 
                                  className="flex items-center gap-2 text-kid-lg font-bold text-foreground flex-wrap"
                                  data-testid={`favorite-match-teams-${match.id}`}
                                >
                                  <span>{match.homeTeam}</span>
                                  <span className="font-mono text-sky-600">
                                    {match.homeScore} - {match.awayScore}
                                  </span>
                                  <span>{match.awayTeam}</span>
                                </div>
                                <p className="text-kid-sm text-muted-foreground mt-1">
                                  {match.stadium}
                                </p>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleRemoveMatch(match.id)}
                                className="flex-shrink-0 text-rose-500"
                                data-testid={`button-remove-match-${match.id}`}
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
