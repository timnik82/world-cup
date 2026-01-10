import tournamentsData from "./tournaments.json";
import matchesData from "./matches.json";
import factsDataEn from "./facts.json";
import factsDataRu from "./facts_ru.json";
import matchDetailsData from "./matchDetails.json";
import {
  TournamentsDataSchema,
  MatchesDataSchema,
  FactsDataSchema,
  MatchDetailsSchema,
  type Tournament,
  type Match,
  type Fact,
  type MatchDetails,
} from "./schemas";

export const tournaments: Tournament[] = TournamentsDataSchema.parse(tournamentsData);
export const matches: Match[] = MatchesDataSchema.parse(matchesData);
export const factsEn: Fact[] = FactsDataSchema.parse(factsDataEn);
export const factsRu: Fact[] = FactsDataSchema.parse(factsDataRu);

export const matchDetails: Record<string, MatchDetails> = {};
for (const [key, value] of Object.entries(matchDetailsData)) {
  matchDetails[key] = MatchDetailsSchema.parse(value);
}

export function getTournamentByYear(year: number): Tournament | undefined {
  return tournaments.find((t) => t.year === year);
}

export function getMatchesByYear(year: number): Match[] {
  return matches.filter((m) => m.tournamentYear === year);
}

export function getMatchesByStage(stage: string): Match[] {
  return matches.filter((m) => m.stage === stage);
}

export function getMatchesByYearAndStage(year: number, stage: string): Match[] {
  return matches.filter((m) => m.tournamentYear === year && m.stage === stage);
}

export function getRandomFact(lang: 'en' | 'ru' | 'pt' = 'en'): Fact {
  // Map languages to their fact collections
  // Portuguese ('pt') falls back to English facts for now
  const factsByLanguage: Record<string, Fact[]> = {
    en: factsEn,
    ru: factsRu,
    pt: factsEn, // Fallback to English for Portuguese
  };
  
  const facts = factsByLanguage[lang] ?? factsEn;
  const randomIndex = Math.floor(Math.random() * facts.length);
  return facts[randomIndex];
}

export function getAllYears(): number[] {
  return tournaments.map((t) => t.year).sort((a, b) => a - b);
}

export function getAllStages(): string[] {
  const stages = new Set(matches.map((m) => m.stage));
  return Array.from(stages);
}

export function computeStats() {
  const totalGoalsByTournament = tournaments.map((t) => ({
    year: t.year,
    goals: t.totalGoals,
    host: t.host,
  }));

  const topScoringMatches = [...matches]
    .map((m) => ({
      ...m,
      totalGoals: m.homeScore + m.awayScore,
    }))
    .sort((a, b) => b.totalGoals - a.totalGoals)
    .slice(0, 5);

  const mostGoalsInTournament = tournaments.reduce((max, t) =>
    t.totalGoals > max.totalGoals ? t : max
  );

  return {
    totalGoalsByTournament,
    topScoringMatches,
    mostGoalsInTournament,
    totalTournaments: tournaments.length,
    totalMatchesInData: matches.length,
  };
}

export type { Tournament, Match, Fact, MatchDetails };
