import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, MapPin, Users, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Match, MatchDetails } from "@/data";
import { fetchMatchDetails } from "@/lib/api";
import { useTranslation } from "@/hooks/use-translation";
import { translateCountry, translateStage } from "@/lib/translation-utils";

interface MatchDetailsModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MatchDetailsModal({ match, isOpen, onClose }: MatchDetailsModalProps) {
  const { t } = useTranslation();
  const tc = (name: string) => translateCountry(t, name);
  const ts = (stage: string) => translateStage(t, stage);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const { data, isLoading, isError, refetch, isFetched } = useQuery<MatchDetails | null>({
    queryKey: ["matchDetails", match?.id],
    queryFn: () => (match ? fetchMatchDetails(match.id) : Promise.resolve(null)),
    enabled: false,
  });

  const handleLoadDetails = () => {
    refetch();
  };

  // Focus trap and Escape key handling
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    },
    [onClose]
  );

  // Manage focus on open/close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.addEventListener("keydown", handleKeyDown);
      // Move focus into modal after animation
      const timer = setTimeout(() => {
        const closeBtn = modalRef.current?.querySelector<HTMLElement>('[data-testid="button-close-modal"]');
        closeBtn?.focus();
      }, 100);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        clearTimeout(timer);
      };
    } else {
      // Restore focus when modal closes
      previousFocusRef.current?.focus();
    }
  }, [isOpen, handleKeyDown]);

  if (!match) return null;

  const modalLabel = `${tc(match.homeTeam)} ${match.homeScore} - ${match.awayScore} ${tc(match.awayTeam)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={modalLabel}
          data-testid="modal-overlay"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-full max-w-3xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            data-testid="modal-content"
          >
            <Card className="border-2 border-emerald-200 shadow-2xl">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white relative">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:bg-white/20"
aria-label={t.modal.close}
                    data-testid="button-close-modal"
                  >
                    <X className="w-6 h-6" aria-hidden="true" />
                  </Button>

                  <div className="text-center">
                    <Badge className="mb-3 bg-white/20 text-white border-0" data-testid="badge-modal-stage">
                      {ts(match.stage)} - {match.tournamentYear}
                    </Badge>
                    <div className="flex items-center justify-center gap-4 mb-2 flex-wrap">
                      <span className="text-kid-2xl md:text-kid-3xl font-bold" data-testid="text-modal-home-team">
                        {tc(match.homeTeam)}
                      </span>
                      <span
                        className="text-kid-4xl md:text-kid-5xl font-bold font-mono bg-white/20 px-6 py-2 rounded-2xl"
                        data-testid="text-modal-score"
                      >
                        {match.homeScore} - {match.awayScore}
                      </span>
                      <span className="text-kid-2xl md:text-kid-3xl font-bold" data-testid="text-modal-away-team">
                        {tc(match.awayTeam)}
                      </span>
                    </div>
                    <p className="text-kid-base opacity-90" data-testid="text-modal-venue">
                      {match.stadium}, {match.city}
                    </p>
                  </div>
                </div>

                <ScrollArea className="max-h-[50vh]">
                  <div className="p-6">
                    {!isFetched && !isLoading && (
                      <div className="text-center py-12" data-testid="load-details-prompt">
                        <p className="text-kid-lg text-muted-foreground mb-6">
                          {t.modal.wantDetails}
                        </p>
                        <Button
                          size="lg"
                          onClick={handleLoadDetails}
                          className="min-h-14 px-8 text-kid-lg font-semibold rounded-2xl"
                          data-testid="button-load-details"
                        >
                          {t.modal.loadDetails}
                        </Button>
                      </div>
                    )}

                    {isLoading && (
                      <div className="flex flex-col items-center justify-center py-12" data-testid="loading-state">
                        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" aria-hidden="true" />
                        <p className="text-kid-lg text-muted-foreground">
                          {t.modal.loading}
                        </p>
                      </div>
                    )}

                    {isError && (
                      <div className="text-center py-12" data-testid="error-state">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" aria-hidden="true" />
                        <p className="text-kid-lg text-red-600 mb-4">
                          {t.modal.error}
                        </p>
                        <Button onClick={() => refetch()} variant="outline" data-testid="button-retry">
                          {t.modal.tryAgain}
                        </Button>
                      </div>
                    )}

                    {data && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                        data-testid="match-details-content"
                      >
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <StatCard
                            icon={<MapPin className="w-5 h-5 text-emerald-500" aria-hidden="true" />}
                            label={t.modal.stadium}
                            value={data.stadium}
                            testId="stat-stadium"
                          />
                          <StatCard
                            icon={<Users className="w-5 h-5 text-sky-500" aria-hidden="true" />}
                            label={t.modal.attendance}
                            value={data.attendance.toLocaleString()}
                            testId="stat-attendance"
                          />
                          <StatCard
                            icon={<User className="w-5 h-5 text-violet-500" aria-hidden="true" />}
                            label={t.modal.referee}
                            value={data.referee}
                            testId="stat-referee"
                          />
                        </div>

                        {data.goals.length > 0 && (
                          <div data-testid="goals-section">
                            <h3 className="text-kid-xl font-bold text-foreground mb-3 flex items-center gap-2">
                              <span className="text-2xl">⚽</span> {t.modal.goals}
                            </h3>
                            <div className="space-y-2">
                              {data.goals.map((goal, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 flex-wrap"
                                  data-testid={`goal-${index}`}
                                >
                                  <span className="font-mono text-kid-lg font-bold text-emerald-600">
                                    {goal.minute}'
                                  </span>
                                  <span className="text-kid-base font-semibold text-foreground">
                                    {goal.player}
                                  </span>
                                  <span className="text-kid-sm text-muted-foreground">
                                    ({tc(goal.team)})
                                  </span>
                                  {goal.type && (
                                    <Badge variant="secondary" className="ml-auto text-kid-xs">
                                      {goal.type}
                                    </Badge>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {data.cards.length > 0 && (
                          <div data-testid="cards-section">
                            <h3 className="text-kid-xl font-bold text-foreground mb-3">
                              {t.modal.cards}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {data.cards.map((card, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className={`text-kid-sm py-2 px-3 ${card.type === "yellow"
                                      ? "bg-amber-50 border-amber-300 text-amber-700"
                                      : "bg-red-50 border-red-300 text-red-700"
                                    }`}
                                  data-testid={`card-${index}`}
                                >
                                  {card.minute}' - {card.player}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {data.substitutions.length > 0 && (
                          <div data-testid="substitutions-section">
                            <h3 className="text-kid-xl font-bold text-foreground mb-3">
                              {t.modal.substitutions}
                            </h3>
                            <div className="space-y-2">
                              {data.substitutions.map((sub, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-kid-sm text-muted-foreground flex-wrap"
                                  data-testid={`substitution-${index}`}
                                >
                                  <span className="font-mono font-bold">{sub.minute}'</span>
                                  <span className="text-red-500">↓ {sub.playerOut}</span>
                                  <span className="text-emerald-500">↑ {sub.playerIn}</span>
                                  <span>({tc(sub.team)})</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatCard({
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
    <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50 text-center" data-testid={testId}>
      <div className="mb-2">{icon}</div>
      <p className="text-kid-xs text-muted-foreground font-medium mb-1">{label}</p>
      <p className="text-kid-sm font-semibold text-foreground" data-testid={`${testId}-value`}>{value}</p>
    </div>
  );
}
