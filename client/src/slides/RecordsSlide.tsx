import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, RefreshCw, TrendingUp, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { computeStats } from "@/data";
import { useTranslation } from "@/hooks/use-translation";

export function RecordsSlide() {
  const [stats, setStats] = useState(() => computeStats());
  const [isRecomputing, setIsRecomputing] = useState(false);
  const { t } = useTranslation();

  const handleRecompute = () => {
    setIsRecomputing(true);
    setTimeout(() => {
      setStats(computeStats());
      setIsRecomputing(false);
    }, 500);
  };

  return (
    <div 
      className="flex flex-col h-full px-6 py-8 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50"
      data-testid="records-slide-content"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4"
      >
        <h2 
          className="text-kid-3xl md:text-kid-4xl font-bold text-foreground flex items-center gap-3 flex-wrap"
          data-testid="text-records-title"
        >
          <Trophy className="w-10 h-10 text-amber-500" data-testid="icon-trophy" />
          {t.records.title}
        </h2>
        <Button
          size="lg"
          variant="outline"
          onClick={handleRecompute}
          disabled={isRecomputing}
          className="min-h-12 px-6 text-kid-base font-semibold rounded-xl"
          data-testid="button-recompute"
        >
          <RefreshCw className={`w-5 h-5 mr-2 ${isRecomputing ? "animate-spin" : ""}`} />
          {t.records.recomputeStats}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <RecordCard
            icon={<Trophy className="w-10 h-10 text-amber-500" />}
            title={t.records.mostGoals}
            value={stats.mostGoalsInTournament.totalGoals.toString()}
            subtitle={`${stats.mostGoalsInTournament.host} ${stats.mostGoalsInTournament.year}`}
            color="amber"
            testId="record-most-goals"
          />
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <RecordCard
            icon={<TrendingUp className="w-10 h-10 text-emerald-500" />}
            title={t.records.tournaments}
            value={stats.totalTournaments.toString()}
            subtitle={t.records.tournamentsSubtitle}
            color="emerald"
            testId="record-tournaments"
          />
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <RecordCard
            icon={<Target className="w-10 h-10 text-sky-500" />}
            title={t.records.matchesRecorded}
            value={stats.totalMatchesInData.toString()}
            subtitle={t.records.historicMatches}
            color="sky"
            testId="record-matches"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 max-w-4xl mx-auto w-full"
      >
        <Card className="border-2 border-orange-200 shadow-xl" data-testid="card-top-scoring">
          <CardContent className="p-6">
            <h3 
              className="text-kid-xl font-bold text-foreground mb-4 flex items-center gap-2"
              data-testid="text-top-scoring-title"
            >
              <span className="text-2xl">⚽</span> {t.records.topScoring}
            </h3>
            <div className="space-y-3">
              {stats.topScoringMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 flex-wrap"
                  data-testid={`top-match-${index}`}
                >
                  <span className="text-kid-2xl font-bold text-amber-500 w-8">
                    #{index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-kid-lg font-bold text-foreground flex-wrap">
                      <span data-testid={`top-match-${index}-home`}>{match.homeTeam}</span>
                      <span className="font-mono text-amber-600" data-testid={`top-match-${index}-score`}>
                        {match.homeScore} - {match.awayScore}
                      </span>
                      <span data-testid={`top-match-${index}-away`}>{match.awayTeam}</span>
                    </div>
                    <div className="text-kid-sm text-muted-foreground flex items-center flex-wrap gap-1">
                      <Badge variant="secondary">{match.stage}</Badge>
                      <span>{match.tournamentYear}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span 
                      className="text-kid-3xl font-bold text-amber-500"
                      data-testid={`top-match-${index}-total`}
                    >
                      {match.totalGoals}
                    </span>
                    <p className="text-kid-xs text-muted-foreground">{t.records.goals}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function RecordCard({
  icon,
  title,
  value,
  subtitle,
  color,
  testId,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: "amber" | "emerald" | "sky";
  testId: string;
}) {
  const bgColors = {
    amber: "from-amber-100 to-orange-100",
    emerald: "from-emerald-100 to-teal-100",
    sky: "from-sky-100 to-cyan-100",
  };

  const borderColors = {
    amber: "border-amber-200",
    emerald: "border-emerald-200",
    sky: "border-sky-200",
  };

  return (
    <Card 
      className={`border-2 ${borderColors[color]} shadow-xl h-full`}
      data-testid={testId}
    >
      <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center">
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${bgColors[color]} mb-4`}>
          {icon}
        </div>
        <p className="text-kid-sm text-muted-foreground font-medium mb-2">{title}</p>
        <motion.p
          key={value}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-kid-5xl font-bold text-foreground mb-2"
          data-testid={`${testId}-value`}
        >
          {value}
        </motion.p>
        <p className="text-kid-base text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
