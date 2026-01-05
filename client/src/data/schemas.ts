import { z } from "zod";

export const TournamentSchema = z.object({
  year: z.number(),
  host: z.string(),
  champion: z.string(),
  runnerUp: z.string(),
  finalScore: z.string(),
  thirdPlace: z.string().optional(),
  fourthPlace: z.string().optional(),
  totalMatches: z.number(),
  totalGoals: z.number(),
  attendance: z.number().optional(),
});

export const MatchSchema = z.object({
  id: z.string(),
  tournamentYear: z.number(),
  stage: z.string(),
  date: z.string(),
  homeTeam: z.string(),
  awayTeam: z.string(),
  homeScore: z.number(),
  awayScore: z.number(),
  stadium: z.string(),
  city: z.string(),
});

export const MatchDetailsSchema = z.object({
  matchId: z.string(),
  stadium: z.string(),
  city: z.string(),
  attendance: z.number(),
  referee: z.string(),
  goals: z.array(z.object({
    player: z.string(),
    team: z.string(),
    minute: z.number(),
    type: z.string().optional(),
  })),
  cards: z.array(z.object({
    player: z.string(),
    team: z.string(),
    minute: z.number(),
    type: z.enum(["yellow", "red"]),
  })),
  substitutions: z.array(z.object({
    playerOut: z.string(),
    playerIn: z.string(),
    team: z.string(),
    minute: z.number(),
  })),
});

export const FactSchema = z.object({
  id: z.string(),
  text: z.string(),
  year: z.number().optional(),
  category: z.string(),
});

export const TournamentsDataSchema = z.array(TournamentSchema);
export const MatchesDataSchema = z.array(MatchSchema);
export const FactsDataSchema = z.array(FactSchema);

export type Tournament = z.infer<typeof TournamentSchema>;
export type Match = z.infer<typeof MatchSchema>;
export type MatchDetails = z.infer<typeof MatchDetailsSchema>;
export type Fact = z.infer<typeof FactSchema>;
