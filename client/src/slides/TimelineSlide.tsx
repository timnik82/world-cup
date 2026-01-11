import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, MapPin, Users, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { getAllYears, getTournamentByYear, type Tournament } from "@/data";
import { useTranslation } from "@/hooks/use-translation";
import { translateCountry } from "@/lib/translation-utils";

/**
 * Render an interactive timeline UI for selecting a year and viewing its tournament details.
 *
 * Displays a year slider, quick-access year buttons, the currently selected year, and an animated
 * tournament card for the chosen year. Uses memoized data from available years and tournaments
 * and updates selection by snapping the slider value to the nearest available year.
 *
 * @returns A React element containing the timeline slider, year controls, and animated tournament card for the selected year.
 */
export function TimelineSlide() {
  const years = useMemo(() => getAllYears(), []);
  const [selectedYear, setSelectedYear] = useState(years[years.length - 1]);
  const tournament = useMemo(() => getTournamentByYear(selectedYear), [selectedYear]);
  const { t } = useTranslation();

  const handleYearChange = (value: number[]) => {
    const closestYear = years.reduce((prev, curr) =>
      Math.abs(curr - value[0]) < Math.abs(prev - value[0]) ? curr : prev
    );
    setSelectedYear(closestYear);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-full px-8 py-14 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50"
      data-testid="timeline-slide-content"
    >
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-kid-4xl md:text-kid-5xl font-bold text-foreground mb-8 text-center"
        data-testid="text-timeline-title"
      >
        <span className="inline-flex items-center gap-3 flex-wrap justify-center">
          <Calendar className="w-12 h-12 text-violet-500" data-testid="icon-calendar" />
          {t.timeline.title}
        </span>
      </motion.h2>
      <div className="w-full max-w-2xl mb-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <span
            className="text-kid-6xl font-bold text-violet-600 font-mono"
            data-testid="text-selected-year"
          >
            {selectedYear}
          </span>
        </motion.div>

        <div className="px-4">
          <div 
            style={{ 
              paddingLeft: `calc(50% / ${years.length})`, 
              paddingRight: `calc(50% / ${years.length})` 
            }}
          >
            <Slider
              value={[selectedYear]}
              min={years[0]}
              max={years[years.length - 1]}
              step={1}
              onValueChange={handleYearChange}
              className="w-full cursor-pointer"
              data-testid="slider-year"
            />
          </div>
          <div 
            className="grid mt-3"
            style={{ gridTemplateColumns: `repeat(${years.length}, 1fr)` }}
          >
            {years.map((year) => (
              <Button
                key={year}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedYear(year)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border border-transparent min-h-8 rounded-md px-1 font-medium transition-colors text-muted-foreground text-[18px] sm:text-[20px]"
                data-testid={`button-year-${year}`}
              >
                {year}
              </Button>
            ))}
          </div>
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

/**
 * Render a card displaying detailed information for a specific tournament year.
 *
 * Displays host country, champion and runner-up, final score, and key statistics
 * (total matches, total goals, and optional attendance) with visual styling and animations.
 *
 * @param tournament - Tournament data to display. Expected fields include:
 *   - year: numeric year of the tournament
 *   - host: host country name
 *   - champion: champion team name
 *   - runnerUp: runner-up team name
 *   - finalScore: final match score string
 *   - totalMatches: total number of matches
 *   - totalGoals: total number of goals
 *   - attendance (optional): total attendance as a number
 * @returns The JSX element rendering the tournament card.
 */
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

        <div className="p-8">
          <div className="text-center mb-8">
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
            className="text-center mb-8 py-6 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-2xl"
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
              icon={<span className="text-2xl">⚽</span>}
              label={t.timeline.totalGoals}
              value={tournament.totalGoals.toString()}
              testId="stat-total-goals"
            />
            {tournament.attendance && (
              <StatBox
                icon={<Users className="w-6 h-6 text-emerald-500" />}
                label={t.timeline.attendance}
                value={`${(tournament.attendance / 1000000).toFixed(1)}M`}
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