import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Sparkles, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRandomFact, type Fact } from "@/data";
import { useFavoritesStore } from "@/store/favorites";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { LanguageToggle } from "@/components/LanguageToggle";

/**
 * Renders the introductory slide with controls to generate a random fact and save it to favorites.
 *
 * Shows a title and subtitle, language toggle, action buttons for "Random Fact" and "Save to Favorites",
 * and an animated card displaying the current fact (including text, optional year, and category) or an empty-state message when no fact is selected.
 *
 * @returns The IntroSlide React element.
 */
export function IntroSlide() {
  const [currentFact, setCurrentFact] = useState<Fact | null>(null);
  const { addFact, isFactFavorite } = useFavoritesStore();
  const { toast } = useToast();
  const { t, language } = useTranslation();

  // Load a fact on mount and refresh when language changes
  // This ensures users see a fact immediately and content stays in sync with language
  useEffect(() => {
    setCurrentFact(getRandomFact(language));
  }, [language]);

  const handleRandomFact = () => {
    const fact = getRandomFact(language);
    setCurrentFact(fact);
  };

  const handleAddToFavorites = () => {
    if (currentFact) {
      if (isFactFavorite(currentFact.id)) {
        toast({
          title: t.intro.alreadySaved,
          description: t.intro.alreadySavedDesc,
        });
        return;
      }
      addFact(currentFact);
      toast({
        title: t.intro.addedToFavorites,
        description: t.intro.savedFact,
      });
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-full px-8 py-14 bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50 relative"
      data-testid="intro-slide-content"
    >
      <div className="absolute top-4 right-4 z-20">
        <LanguageToggle />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Trophy className="w-16 h-16 text-amber-500" data-testid="icon-trophy-left" />
          </motion.div>
          <h1 className="text-kid-5xl md:text-kid-6xl font-bold text-foreground tracking-tight" data-testid="text-main-title">
            {t.intro.title}
          </h1>
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <Trophy className="w-16 h-16 text-amber-500" data-testid="icon-trophy-right" />
          </motion.div>
        </div>
        <p className="text-kid-xl md:text-kid-2xl text-muted-foreground font-medium" data-testid="text-subtitle">
          {t.intro.subtitle}
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <Button
          size="lg"
          onClick={handleRandomFact}
          className="min-h-14 px-8 text-kid-lg font-semibold rounded-2xl"
          data-testid="button-random-fact"
        >
          <Shuffle className="w-6 h-6 mr-2" />
          {t.intro.randomFact}
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onClick={handleAddToFavorites}
          disabled={!currentFact}
          className="min-h-14 px-8 text-kid-lg font-semibold rounded-2xl disabled:opacity-50"
          data-testid="button-add-favorite"
        >
          <Star className="w-6 h-6 mr-2" />
          {t.intro.saveToFavorites}
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
            <Card className="border-2 border-sky-200 shadow-xl" data-testid={`card-fact-${currentFact.id}`}>
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-sky-100">
                    <Sparkles className="w-8 h-8 text-sky-500" data-testid="icon-sparkles" />
                  </div>
                  <div className="flex-1">
                    <p className="text-kid-xl md:text-kid-2xl font-medium text-foreground leading-relaxed" data-testid="text-fact-content">
                      {currentFact.text}
                    </p>
                    {currentFact.year && (
                      <p className="mt-3 text-kid-base text-muted-foreground font-medium" data-testid="text-fact-year">
                        {t.intro.worldCup} {currentFact.year}
                      </p>
                    )}
                    <span
                      className="inline-block mt-3 px-3 py-1 text-kid-sm font-medium rounded-full bg-sky-100 text-sky-700 capitalize"
                      data-testid="badge-fact-category"
                    >
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
          data-testid="text-empty-state"
        >
          <p className="flex items-center gap-2 justify-center flex-wrap">
            <Sparkles className="w-5 h-5" />
            {t.intro.emptyState}
          </p>
        </motion.div>
      )}
    </div>
  );
}