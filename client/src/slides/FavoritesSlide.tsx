import { motion, AnimatePresence } from "framer-motion";
import { Star, Trash2, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFavoritesStore } from "@/store/favorites";
import { useToast } from "@/hooks/use-toast";

export function FavoritesSlide() {
  const { favoriteFacts, favoriteMatches, removeFact, removeMatch } = useFavoritesStore();
  const { toast } = useToast();

  const handleRemoveFact = (factId: string) => {
    removeFact(factId);
    toast({
      title: "Removed!",
      description: "Fact removed from favorites.",
    });
  };

  const handleRemoveMatch = (matchId: string) => {
    removeMatch(matchId);
    toast({
      title: "Removed!",
      description: "Match removed from favorites.",
    });
  };

  const isEmpty = favoriteFacts.length === 0 && favoriteMatches.length === 0;

  return (
    <div className="flex flex-col h-full px-6 py-8 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50">
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-kid-3xl md:text-kid-4xl font-bold text-foreground mb-8 text-center flex items-center justify-center gap-3"
      >
        <Heart className="w-10 h-10 text-rose-500 fill-rose-500" />
        My Favorites
      </motion.h2>

      {isEmpty ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center"
        >
          <div className="p-6 rounded-full bg-rose-100 mb-6">
            <Star className="w-16 h-16 text-rose-300" />
          </div>
          <h3 className="text-kid-2xl font-bold text-foreground mb-3">
            No favorites yet!
          </h3>
          <p className="text-kid-lg text-muted-foreground max-w-md">
            Go explore the other slides and save your favorite facts and matches by clicking
            the star button!
          </p>
        </motion.div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full pb-4">
            <div>
              <h3 className="text-kid-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-500" />
                Favorite Facts ({favoriteFacts.length})
              </h3>
              <div className="space-y-3">
                <AnimatePresence>
                  {favoriteFacts.length === 0 ? (
                    <p className="text-kid-base text-muted-foreground py-4">
                      No favorite facts saved yet.
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
                        <Card className="border-2 border-amber-100 shadow-md bg-white">
                          <CardContent className="p-4">
                            <div className="flex gap-3">
                              <div className="flex-1">
                                <p className="text-kid-base text-foreground leading-relaxed">
                                  {fact.text}
                                </p>
                                {fact.year && (
                                  <p className="text-kid-sm text-muted-foreground mt-2">
                                    World Cup {fact.year}
                                  </p>
                                )}
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleRemoveFact(fact.id)}
                                className="flex-shrink-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
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

            <div>
              <h3 className="text-kid-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="text-xl">⚽</span>
                Favorite Matches ({favoriteMatches.length})
              </h3>
              <div className="space-y-3">
                <AnimatePresence>
                  {favoriteMatches.length === 0 ? (
                    <p className="text-kid-base text-muted-foreground py-4">
                      No favorite matches saved yet.
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
                        <Card className="border-2 border-sky-100 shadow-md bg-white">
                          <CardContent className="p-4">
                            <div className="flex gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="px-2 py-0.5 text-kid-xs font-semibold rounded-full bg-sky-100 text-sky-700">
                                    {match.stage}
                                  </span>
                                  <span className="text-kid-xs text-muted-foreground">
                                    {match.tournamentYear}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-kid-lg font-bold text-foreground">
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
                                className="flex-shrink-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
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
