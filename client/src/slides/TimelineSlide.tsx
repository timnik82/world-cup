import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, MapPin, Users, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllYears, getTournamentByYear, type Tournament } from "@/data";
import { useTranslation } from "@/hooks/use-translation";
import { translateCountry } from "@/lib/translation-utils";

export function TimelineSlide() {
  const years = useMemo(() => getAllYears(), []);
  const [selectedYear, setSelectedYear] = useState(years[years.length - 1]);
  const tournament = useMemo(() => getTournamentByYear(selectedYear), [selectedYear]);
  const { t } = useTranslation();
  const selectedIndex = years.indexOf(selectedYear);
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  useEffect(() => {
    const btn = buttonRefs.current[selectedYear];
    if (btn && scrollRef.current) {
      btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [selectedYear]);

  const goToPrev = () => {
    if (selectedIndex > 0) setSelectedYear(years[selectedIndex - 1]);
  };
  const goToNext = () => {
    if (selectedIndex < years.length - 1) setSelectedYear(years[selectedIndex + 1]);
  };

  return (
    <div
      className="flex flex-col items-center justify-start min-h-full px-4 sm:px-8 py-10 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50"
      data-testid="timeline-slide-content"
    >
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-kid-4xl md:text-kid-5xl font-bold text-foreground mb-6 text-center"
        data-testid="text-timeline-title"
      >
        <span className="inline-flex items-center gap-3 flex-wrap justify-center">
          <Calendar className="w-12 h-12 text-violet-500" data-testid="icon-calendar" />
          {t.timeline.title}
        </span>
      </motion.h2>

      <div className="w-full max-w-3xl mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={goToPrev}
            disabled={selectedIndex === 0}
            data-testid="button-year-prev"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div
            ref={scrollRef}
            className="flex-1 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex gap-1 sm:gap-1.5 px-1 py-1">
              {years.map((year) => (
                <Button
                  key={year}
                  ref={(el) => { buttonRefs.current[year] = el; }}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedYear(year)}
                  className={`shrink-0 text-[14px] sm:text-[16px] font-mono font-semibold transition-all ${
                    selectedYear === year
                      ? "bg-violet-500 text-white hover:bg-violet-600"
                      : "text-muted-foreground"
                  }`}
                  data-testid={`button-year-${year}`}
                >
                  {year}
                </Button>
              ))}
            </div>
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={goToNext}
            disabled={selectedIndex === years.length - 1}
            data-testid="button-year-next"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-2"
        >
          <span
            className="text-kid-5xl sm:text-kid-6xl font-bold text-violet-600 font-mono"
            data-testid="text-selected-year"
          >
            {selectedYear}
          </span>
        </motion.div>

        <div className="flex justify-center gap-1 mb-2">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`h-1.5 rounded-full transition-all ${
                selectedYear === year
                  ? "w-4 bg-violet-500"
                  : "w-1.5 bg-violet-200 hover:bg-violet-300"
              }`}
              data-testid={`dot-year-${year}`}
              aria-label={`Select ${year}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tournament && (
          <motion.div
            key={tournament.year}
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="w-full max-w-4xl"
          >
            <TournamentCard tournament={tournament} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TournamentCard({ tournament }: { tournament: Tournament }) {
  const { t } = useTranslation();
  const tc = (name: string) => translateCountry(t, name);

  return (
    <Card
      className="border-2 border-violet-200 shadow-2xl overflow-hidden"
      data-testid={`card-tournament-${tournament.year}`}
    >
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-[10px] text-white">
          <div className="flex items-center justify-center gap-3 mb-2 flex-wrap">
            <MapPin className="w-6 h-6" data-testid="icon-mappin" />
            <span className="text-kid-2xl md:text-kid-3xl font-bold" data-testid="text-host-country">
              {tc(tournament.host)}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <Trophy className="w-14 h-14 text-amber-500" data-testid="icon-trophy-champion" />
              </motion.div>
              <div>
                <p className="text-kid-sm text-muted-foreground font-medium mb-1">{t.timeline.champion}</p>
                <p className="text-kid-3xl md:text-kid-4xl font-bold text-foreground" data-testid="text-champion">
                  {tc(tournament.champion)}
                </p>
              </div>
            </div>
            <p className="text-kid-lg text-muted-foreground" data-testid="text-runner-up">
              vs <span className="font-semibold text-foreground">{tc(tournament.runnerUp)}</span>
            </p>
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-6 sm:mb-8 py-6 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-2xl"
          >
            <p className="text-kid-sm text-violet-600 font-semibold mb-2">{t.timeline.finalScore}</p>
            <p
              className="text-kid-xl sm:text-kid-2xl md:text-kid-6xl font-bold font-mono text-violet-700 whitespace-nowrap overflow-hidden text-ellipsis px-2"
              data-testid="text-final-score"
            >
              {tournament.finalScore}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatBox
              icon={<Users className="w-6 h-6 text-sky-500" />}
              label={t.timeline.totalMatches}
              value={tournament.totalMatches.toString()}
              testId="stat-total-matches"
            />
            <StatBox
              icon={<Trophy className="w-6 h-6 text-amber-500" />}
              label={t.timeline.totalGoals}
              value={tournament.totalGoals.toString()}
              testId="stat-total-goals"
            />
            {tournament.attendance && (
              <StatBox
                icon={<Users className="w-6 h-6 text-emerald-500" />}
                label={t.timeline.attendance}
                value={tournament.attendance >= 1000000
                  ? `${(tournament.attendance / 1000000).toFixed(1)}M`
                  : `${Math.round(tournament.attendance / 1000)}K`}
                testId="stat-attendance"
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatBox({
  icon,
  label,
  value,
  testId,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  testId: string;
}) {
  return (
    <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50" data-testid={testId}>
      <div className="mb-2">{icon}</div>
      <p className="text-kid-2xl font-bold text-foreground" data-testid={`${testId}-value`}>{value}</p>
      <p className="text-kid-xs text-muted-foreground font-medium">{label}</p>
    </div>
  );
}
