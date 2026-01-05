import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, MapPin, Users, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { getAllYears, getTournamentByYear, type Tournament } from "@/data";

export function TimelineSlide() {
  const years = useMemo(() => getAllYears(), []);
  const [selectedYear, setSelectedYear] = useState(years[years.length - 1]);
  const tournament = useMemo(() => getTournamentByYear(selectedYear), [selectedYear]);

  const handleYearChange = (value: number[]) => {
    const closestYear = years.reduce((prev, curr) =>
      Math.abs(curr - value[0]) < Math.abs(prev - value[0]) ? curr : prev
    );
    setSelectedYear(closestYear);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-12 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50">
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-kid-4xl md:text-kid-5xl font-bold text-foreground mb-8 text-center"
      >
        <span className="inline-flex items-center gap-3">
          <Calendar className="w-12 h-12 text-violet-500" />
          World Cup Timeline
        </span>
      </motion.h2>

      <div className="w-full max-w-2xl mb-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <span className="text-kid-6xl font-bold text-violet-600 font-mono">
            {selectedYear}
          </span>
        </motion.div>

        <div className="px-4">
          <Slider
            value={[selectedYear]}
            min={years[0]}
            max={years[years.length - 1]}
            step={1}
            onValueChange={handleYearChange}
            className="w-full cursor-pointer"
            data-testid="slider-year"
          />
          <div className="flex justify-between mt-3 text-kid-sm font-medium text-muted-foreground">
            {years.map((year) => (
              <span
                key={year}
                className={`transition-colors ${
                  year === selectedYear ? "text-violet-600 font-bold" : ""
                }`}
              >
                {year}
              </span>
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

function TournamentCard({ tournament }: { tournament: Tournament }) {
  return (
    <Card className="border-2 border-violet-200 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 p-6 text-white">
          <div className="flex items-center justify-center gap-3 mb-2">
            <MapPin className="w-6 h-6" />
            <span className="text-kid-2xl md:text-kid-3xl font-bold">{tournament.host}</span>
          </div>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <Trophy className="w-14 h-14 text-amber-500" />
              </motion.div>
              <div>
                <p className="text-kid-sm text-muted-foreground font-medium mb-1">Champion</p>
                <p className="text-kid-3xl md:text-kid-4xl font-bold text-foreground">
                  {tournament.champion}
                </p>
              </div>
            </div>
            <p className="text-kid-lg text-muted-foreground">
              vs <span className="font-semibold text-foreground">{tournament.runnerUp}</span>
            </p>
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8 py-6 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-2xl"
          >
            <p className="text-kid-sm text-violet-600 font-semibold mb-2">Final Score</p>
            <p className="text-kid-5xl md:text-kid-6xl font-bold font-mono text-violet-700">
              {tournament.finalScore}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatBox
              icon={<Users className="w-6 h-6 text-sky-500" />}
              label="Total Matches"
              value={tournament.totalMatches.toString()}
            />
            <StatBox
              icon={<span className="text-2xl">⚽</span>}
              label="Total Goals"
              value={tournament.totalGoals.toString()}
            />
            {tournament.attendance && (
              <StatBox
                icon={<Users className="w-6 h-6 text-emerald-500" />}
                label="Attendance"
                value={`${(tournament.attendance / 1000000).toFixed(1)}M`}
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
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50">
      <div className="mb-2">{icon}</div>
      <p className="text-kid-2xl font-bold text-foreground">{value}</p>
      <p className="text-kid-xs text-muted-foreground font-medium">{label}</p>
    </div>
  );
}
