import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Sparkles, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRandomFact, type Fact } from "@/data";
import { useFavoritesStore } from "@/store/favorites";
import { useToast } from "@/hooks/use-toast";

export function IntroSlide() {
  const [currentFact, setCurrentFact] = useState<Fact | null>(null);
  const { addFact, isFactFavorite } = useFavoritesStore();
  const { toast } = useToast();

  const handleRandomFact = () => {
    const fact = getRandomFact();
    setCurrentFact(fact);
  };

  const handleAddToFavorites = () => {
    if (currentFact) {
      if (isFactFavorite(currentFact.id)) {
        toast({
          title: "Already saved!",
          description: "This fact is already in your favorites.",
        });
        return;
      }
      addFact(currentFact);
      toast({
        title: "Added to favorites!",
        description: "You saved this cool fact!",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-12 bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Trophy className="w-16 h-16 text-amber-500" />
          </motion.div>
          <h1 className="text-kid-5xl md:text-kid-6xl font-bold text-foreground tracking-tight">
            FIFA World Cup
          </h1>
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <Trophy className="w-16 h-16 text-amber-500" />
          </motion.div>
        </div>
        <p className="text-kid-xl md:text-kid-2xl text-muted-foreground font-medium">
          Explore the history of the world's biggest soccer tournament!
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <Button
          size="lg"
          onClick={handleRandomFact}
          className="min-h-14 px-8 text-kid-lg font-semibold rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-600 shadow-lg"
          data-testid="button-random-fact"
        >
          <Shuffle className="w-6 h-6 mr-2" />
          Random Fun Fact
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onClick={handleAddToFavorites}
          disabled={!currentFact}
          className="min-h-14 px-8 text-kid-lg font-semibold rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 border-amber-500 text-amber-900 shadow-lg disabled:opacity-50"
          data-testid="button-add-favorite"
        >
          <Star className="w-6 h-6 mr-2" />
          Save to Favorites
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {currentFact && (
          <motion.div
            key={currentFact.id}
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="w-full max-w-3xl"
          >
            <Card className="border-2 border-sky-200 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-sky-100">
                    <Sparkles className="w-8 h-8 text-sky-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-kid-xl md:text-kid-2xl font-medium text-foreground leading-relaxed">
                      {currentFact.text}
                    </p>
                    {currentFact.year && (
                      <p className="mt-3 text-kid-base text-muted-foreground font-medium">
                        World Cup {currentFact.year}
                      </p>
                    )}
                    <span className="inline-block mt-3 px-3 py-1 text-kid-sm font-medium rounded-full bg-sky-100 text-sky-700 capitalize">
                      {currentFact.category}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!currentFact && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted-foreground text-kid-lg"
        >
          <p className="flex items-center gap-2 justify-center">
            <Sparkles className="w-5 h-5" />
            Click "Random Fun Fact" to discover cool World Cup facts!
          </p>
        </motion.div>
      )}
    </div>
  );
}
